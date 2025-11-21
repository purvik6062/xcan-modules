import { Db } from "mongodb";

export type ModuleId =
  | "web3-basics"
  | "stylus-core-concepts"
  | "precompiles-overview"
  | "cross-chain"
  | "master-defi"
  | "master-orbit";

export type ModuleAlias =
  | "defi-arbitrum" // Maps to "master-defi"
  | "arbitrum-orbit"; // Maps to "master-orbit"

export type ModuleIdentifier = ModuleId | ModuleAlias;

export const MODULE_ID_MAP: Record<string, ModuleId> = {
  "web3-basics": "web3-basics",
  "stylus-core-concepts": "stylus-core-concepts",
  "precompiles-overview": "precompiles-overview",
  "cross-chain": "cross-chain",
  "master-defi": "master-defi",
  "defi-arbitrum": "master-defi", // Alias
  "master-orbit": "master-orbit",
  "arbitrum-orbit": "master-orbit", // Alias
};

export const COLLECTION_TO_MODULE_ID: Record<string, ModuleId> = {
  "challenges-web3-basics": "web3-basics",
  "challenges-stylus-core-concepts": "stylus-core-concepts",
  "challenges-precompiles-overview": "precompiles-overview",
  "challenges-cross-chain": "cross-chain",
  "challenges-master-defi": "master-defi",
  "challenges-orbit-chain": "master-orbit",
};

export function normalizeModuleId(module: ModuleIdentifier): ModuleId {
  return MODULE_ID_MAP[module] || (module as ModuleId);
}

export async function getModuleData(
  db: Db,
  userAddress: string,
  moduleId: ModuleIdentifier
): Promise<any | null> {
  const normalizedModuleId = normalizeModuleId(moduleId);
  const normalizedAddress = userAddress.toLowerCase();

  const doc = await db
    .collection("user-modules")
    .findOne(
      { userAddress: normalizedAddress },
      { projection: { [`modules.${normalizedModuleId}`]: 1 } }
    );

  return doc?.modules?.[normalizedModuleId] || null;
}

export async function getAllModuleData(
  db: Db,
  userAddress: string
): Promise<Record<string, any>> {
  const normalizedAddress = userAddress.toLowerCase();

  const doc = await db
    .collection("user-modules")
    .findOne(
      { userAddress: normalizedAddress },
      { projection: { modules: 1 } }
    );

  return doc?.modules || {};
}

export async function updateModuleData(
  db: Db,
  userAddress: string,
  moduleId: ModuleIdentifier,
  moduleData: any,
  options: { upsert?: boolean } = {}
): Promise<void> {
  const normalizedModuleId = normalizeModuleId(moduleId);
  const normalizedAddress = userAddress.toLowerCase();

  const update: any = {
    $set: {
      [`modules.${normalizedModuleId}`]: {
        ...moduleData,
        updatedAt: new Date(),
      },
      updatedAt: new Date(),
    },
  };

  if (options.upsert) {
    update.$setOnInsert = {
      userAddress: normalizedAddress,
      createdAt: new Date(),
    };
    // Set createdAt for the module if it doesn't exist
    update.$set[`modules.${normalizedModuleId}`].createdAt = new Date();
  }

  await db
    .collection("user-modules")
    .updateOne({ userAddress: normalizedAddress }, update, {
      upsert: options.upsert || false,
    });
}

/**
 * Updates a specific field within a module
 */
export async function updateModuleField(
  db: Db,
  userAddress: string,
  moduleId: ModuleIdentifier,
  fieldPath: string,
  value: any,
  options: { upsert?: boolean } = {}
): Promise<void> {
  const normalizedModuleId = normalizeModuleId(moduleId);
  const normalizedAddress = userAddress.toLowerCase();

  const update: any = {
    $set: {
      [`modules.${normalizedModuleId}.${fieldPath}`]: value,
      [`modules.${normalizedModuleId}.updatedAt`]: new Date(),
      updatedAt: new Date(),
    },
  };

  if (options.upsert) {
    update.$setOnInsert = {
      userAddress: normalizedAddress,
      createdAt: new Date(),
    };
  }

  await db
    .collection("user-modules")
    .updateOne({ userAddress: normalizedAddress }, update, {
      upsert: options.upsert || false,
    });
}

/**
 * Adds an item to an array field within a module (e.g., certification array)
 */
export async function addToModuleArray(
  db: Db,
  userAddress: string,
  moduleId: ModuleIdentifier,
  arrayField: string,
  item: any,
  options: { upsert?: boolean; unique?: boolean; replace?: boolean } = {}
): Promise<void> {
  const normalizedModuleId = normalizeModuleId(moduleId);
  const normalizedAddress = userAddress.toLowerCase();

  // If replace is true, set the entire array instead of adding to it
  if (options.replace) {
    const update: any = {
      $set: {
        [`modules.${normalizedModuleId}.${arrayField}`]: item,
        [`modules.${normalizedModuleId}.updatedAt`]: new Date(),
        updatedAt: new Date(),
      },
    };

    if (options.upsert) {
      update.$setOnInsert = {
        userAddress: normalizedAddress,
        createdAt: new Date(),
      };
    }

    await db
      .collection("user-modules")
      .updateOne({ userAddress: normalizedAddress }, update, {
        upsert: options.upsert || false,
      });
    return;
  }

  const update: any = {
    $set: {
      [`modules.${normalizedModuleId}.updatedAt`]: new Date(),
      updatedAt: new Date(),
    },
  };

  if (options.unique) {
    update.$addToSet = {
      [`modules.${normalizedModuleId}.${arrayField}`]: item,
    };
  } else {
    update.$push = {
      [`modules.${normalizedModuleId}.${arrayField}`]: item,
    };
  }

  if (options.upsert) {
    update.$setOnInsert = {
      userAddress: normalizedAddress,
      createdAt: new Date(),
    };
  }

  await db
    .collection("user-modules")
    .updateOne({ userAddress: normalizedAddress }, update, {
      upsert: options.upsert || false,
    });
}

/**
 * Updates or adds a certification entry to the certification array
 * If a certification with the same levelName exists, it updates it; otherwise adds a new one
 */
export async function upsertCertification(
  db: Db,
  userAddress: string,
  moduleId: ModuleIdentifier,
  certification: any,
  options: { upsert?: boolean } = {}
): Promise<void> {
  const normalizedModuleId = normalizeModuleId(moduleId);
  const normalizedAddress = userAddress.toLowerCase();

  // First, get existing module data
  const existing = await getModuleData(db, userAddress, moduleId);
  const existingCertifications = Array.isArray(existing?.certification)
    ? existing.certification
    : [];

  // Check if certification with same levelName exists
  const certIndex = existingCertifications.findIndex(
    (cert: any) => cert.levelName === certification.levelName
  );

  let updatedCertifications;
  if (certIndex >= 0) {
    // Update existing certification
    updatedCertifications = [...existingCertifications];
    updatedCertifications[certIndex] = {
      ...updatedCertifications[certIndex],
      ...certification,
    };
  } else {
    // Add new certification
    updatedCertifications = [...existingCertifications, certification];
  }

  const modulePayload = {
    ...(existing || {}),
    certification: updatedCertifications,
  };

  await updateModuleData(db, userAddress, moduleId, modulePayload, options);
}
