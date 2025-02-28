import { NextRequest, NextResponse } from 'next/server';
import { createReadStream } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import openai from '@/utils/openai/client';


export async function POST(req: NextRequest) {
  try {
    // 1) Parse the incoming FormData
    const formData = await req.formData();
    const file = formData.get('audioFile') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file found' }, { status: 400 });
    }

    // 2) Convert to a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3) Write buffer to a temporary file
    const tempFilePath = path.join('/tmp', `${randomUUID()}.wav`);
    await writeFile(tempFilePath, buffer);

    // 4) Call Whisper (OpenAI) with a read stream
    //    The official method is openai.createTranscription(...)
    //    Or openai.audio.transcriptions.create(...) depending on your SDK version
    const transcription = await openai.audio.transcriptions.create({
      model: 'whisper-1',
      file: createReadStream(tempFilePath),
    });

    // 5) Return the transcription
    return NextResponse.json(transcription);
  } catch (error: any) {
    console.error('Transcription Error:', error);
    return NextResponse.json({ error: error.message || 'Error' }, { status: 500 });
  }
}