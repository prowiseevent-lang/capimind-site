import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function editLogo() {
  const zai = await ZAI.create();

  // Read the logo and convert to base64
  const imageBuffer = fs.readFileSync('/home/z/my-project/upload/Logo.jpg');
  const base64Image = imageBuffer.toString('base64');
  const dataUrl = `data:image/jpeg;base64,${base64Image}`;

  console.log('🔄 Editing logo: removing white background, 4K quality...');

  const response = await zai.images.generations.edit({
    prompt: 'CapiMind logo with exact same design and text "CapiMind" and "Designed for Exceptional Minds" and ".com", remove white background completely making it fully transparent, keep the exact same colors (green for Capi, orange-red for Mind, red upward arrow), ultra high quality 4K resolution, crisp sharp edges, no white background at all, clean transparent background PNG',
    images: [{ url: dataUrl }],
    size: '1024x1024',
  });

  const editedBase64 = response.data[0].base64;
  const outputBuffer = Buffer.from(editedBase64, 'base64');
  fs.writeFileSync('/home/z/my-project/public/images/logo-transparent.png', outputBuffer);

  console.log(`✅ Logo edited and saved! Size: ${outputBuffer.length} bytes`);
}

editLogo().catch(console.error);
