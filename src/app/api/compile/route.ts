import { NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

export async function POST(request: Request) {
  try {
    const { languageChoice, program } = await request.json();
    
    // Get API keys from environment variables with proper validation
    const apiKeys = [
      process.env.RAPID_API_KEY1,
      process.env.RAPID_API_KEY2,
      process.env.RAPID_API_KEY3, 
      process.env.RAPID_API_KEY4,
      process.env.RAPID_API_KEY5
    ]
    .filter(key => key && key.trim() !== '') // Filter out undefined or empty keys
    .map(key => key?.trim().replace(/;$/, '')); // Remove any whitespace and trailing semicolons
    
    if (apiKeys.length === 0) {
      return NextResponse.json({ 
        error: 'No API keys configured. Please add API keys to environment variables.' 
      }, { status: 500 });
    }
    
    // Try each API key until one works
    let response;
    let lastError: Error | AxiosError | null = null;
    
    for (const apiKey of apiKeys) {
      try {
        const encodedParams = new URLSearchParams();
        encodedParams.set('LanguageChoice', languageChoice);
        encodedParams.set('Program', program);
        
        const options = {
          method: 'POST',
          url: 'https://code-compiler.p.rapidapi.com/v2',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'code-compiler.p.rapidapi.com',
          },
          data: encodedParams,
        };
        
        // Debug: Log that we're attempting to use a specific key (without showing the actual key)
        console.log(`Attempting to use API key ${apiKeys.indexOf(apiKey) + 1}`);
        
        response = await axios.request(options);
        
        // If we get here, the request was successful
        console.log(`API key ${apiKeys.indexOf(apiKey) + 1} worked successfully`);
        break;
      } catch (e) {
        // Save the error but keep trying other keys
        lastError = e as Error;
        const axiosError = e as AxiosError;
        console.log(`API key ${apiKeys.indexOf(apiKey) + 1} failed with status: ${axiosError.response?.status}, error: ${axiosError.message}`);
      }
    }
    
    if (response) {
      return NextResponse.json(response.data);
    } else {
      // All keys failed
      throw lastError || new Error('All API keys failed');
    }
    
  } catch (error: any) {
    console.error('Error compiling code:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to compile code',
        details: error.response?.data || 'No additional details available'
      },
      { status: error.response?.status || 500 }
    );
  }
} 