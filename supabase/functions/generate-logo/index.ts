import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import OpenAI from 'npm:openai@4.28.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface GenerateLogoRequest {
  companyName: string;
  companyDescription: string;
  style: 'block' | 'sharp' | 'rounded';
}

const stylePrompts = {
  block: `Create a minimalist, abstract logo mark for a company named {company name}. The logo must be a pure white vector-style shape centered on a solid black background — with no text, no letters, and no recognizable symbols.

The company is described as: {company description}

🔒 Design Rules:
Absolutely no letters, characters, or typographic elements. The design must be fully abstract and symbolic — not a monogram.

Use blocky, rectangular, and modular shapes, constructed with medium or light line thickness — avoid thick, heavy forms.

Emphasize precision, clarity, and structural lightness. Every line should feel intentional, functional, and engineered.

Think in terms of modular logic: cutouts, repetition, symmetry, and grid-aware compositions.

Use 1–2 strong visual motifs only. The design must remain recognizable and crisp at small sizes.

Must look like it belongs to a company that builds intelligent, systematic, high-clarity tools or infrastructure.

🧠 Style & Form Guidance:
Incorporate geometric features like light brackets, frames, inset corners, or mirrored segments.

Favor clean negative space, thin borders, or structural voids over solid fills.

The shape should have defined corners (90° or chamfered) — no soft curves unless extremely controlled.

Consider influence from:

Technical UI schematics

Modular architecture

Scanline or grid-based systems

Futuristic control panels or hardware outlines

The mark should evoke intelligence, modularity, and signal clarity, not bulk or visual noise.

🧭 Constraints:
Line weight: Use medium or light stroke weight only — no thick or blocky fills.

Color: Only white on black (pure white logo shape, solid black background)

Visual depth: Flat, vector-only. No gradients, shadows, or textures.

Overall tone: Clean, refined, and quietly confident — subtle, not loud.`,

  sharp: `Create a bold, minimalistic logo mark for a company named {company name}. The logo should be a clean, white vector-style icon centered on a solid black background. Do not include any text or letters—focus entirely on an abstract or symbolic shape that conveys the company's identity.

The company is described as: {company description}

The logo must follow these criteria:

Geometric, angular, and sharply defined—favor hard edges, strong diagonals, and precise symmetry or intentional asymmetry.

Avoid curves or rounded corners—the mark should feel engineered, purposeful, and assertive.

Must remain distinct and recognizable at small sizes, using no more than 1–2 strong visual motifs.

Modern and timeless, with a minimal form that implies strength, focus, motion, structure, or clarity.

Visually resonate with the company's industry (tech, finance, AI, infrastructure, etc.), through symbolic sharpness and abstraction.

Stylistic inspirations may include:

Architectural structures (trusses, beams, cantilevers)

Blade-like, triangular, or tapered forms

Digital signals, brackets, or futuristic runes

Mechanical, modular, or tectonic geometry

Symmetrical axes or fractal-like branching (but angular)

Visual constraints:

Background must be solid black.

The logo itself must be pure white.

No gradients, no color, no shadows—keep the design flat and crisp.

The final result should feel like it could stand beside icons like Apple, Adobe, or Fnatic—instantly recognizable, timeless, and deeply tied to the company's core identity through minimal, sharp, abstract form.`,

  rounded: `Create a minimalist, abstract logo mark for a company named {company name}. The logo must be a pure white vector-style shape centered on a solid black background. Avoid any text, letters, or recognizable symbols — focus on form, structure, and visual balance to represent the brand's essence.

The company is described as: {company description}

The logo must:
Use bold, clean lines with a blend of angular geometry and smooth curvature — think rounded corners with consistent stroke widths, not sharp spikes or overly complex paths.

Be composed of purely abstract forms (no arrows, text symbols, or UI metaphors).

Emphasize symmetry, balance, or subtle rhythmic asymmetry, similar to modernist or generative design.

Convey a feeling of order, clarity, and system — without being too literal.

Contain 1–2 strong visual ideas, and be instantly recognizable even when small.

Visual inspiration:
Modular, curved systems like sound waves, nested rings, or organic layers.

Structured yet abstract shapes — stacked forms, bent grids, arcs with uniform radii, curved brackets, or layered signals.

Visual rhythm from repetition or mirroring — similar to mechanical or data flow patterns.

Think of logos like Oura, Sonos, Linear, or Notion — clean, abstract, and subtly expressive.

Stylistic inspirations may include:

Architectural structures (trusses, beams, cantilevers)

Blade-like, triangular, or tapered forms

Digital signals, brackets, or futuristic runes

Mechanical, modular, or tectonic geometry

Symmetrical axes or fractal-like branching (but angular)

Visual constraints:

Background must be solid black.

The logo itself must be pure white.

No gradients, no color, no shadows—keep the design flat and crisp.

The final result should feel like it could stand beside icons like Apple, Adobe, or Fnatic—instantly recognizable, timeless, and deeply tied to the company's core identity through minimal, sharp, abstract form.`
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));

    if (userError || !user) {
      throw new Error('Invalid token');
    }

    const { companyName, companyDescription, style } = await req.json() as GenerateLogoRequest;

    const prompt = stylePrompts[style]
      .replace('{company name}', companyName)
      .replace('{company description}', companyDescription);

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    // Use gpt-image-1 and expect base64 return
    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      n: 1,
      size: "1024x1024",
      output_format: "png",
      background: "transparent",
      quality: "high",
    });

    const base64Image = response.data[0].b64_json;
    if (!base64Image) {
      throw new Error('OpenAI returned no image data.');
    }

    // Optional: Upload to Supabase Storage (uncomment if needed)
    // const buffer = Uint8Array.from(atob(base64Image), c => c.charCodeAt(0));
    // await supabase.storage.from('logos').upload(`logo-${Date.now()}.png`, buffer, {
    //   contentType: "image/png",
    // });

    // Save metadata to DB
    const { error: dbError } = await supabase
      .from('logos')
      .insert({
        user_id: user.id,
        prompt,
        style,
        image_url: `data:image/png;base64,${base64Image}`,
        company_name: companyName,
        company_description: companyDescription,
      });

    if (dbError) {
      throw dbError;
    }

    return new Response(
      JSON.stringify({ base64: base64Image }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
