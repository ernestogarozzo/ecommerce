import torch, base64
from io import BytesIO

from diffusers import StableDiffusionPipeline





# make sure you're logged in with `huggingface-cli login`
pipe = StableDiffusionPipeline.from_pretrained("stabilityai/stable-diffusion-2-1-base", revision="fp16", torch_dtype=torch.float16)  
pipe = pipe.to("cuda")

def aiModel(prompt):
    if(len(prompt) > 5):
        image = pipe(prompt).images[0]
        buffered = BytesIO()
        image.save(buffered, format="JPEG")
        encoded_image = base64.b64encode(buffered.getvalue())
        data = {"text": prompt,"encoded_image": encoded_image}
    else:
        data = {{"text": prompt,"encoded_image": "text < 5"}}
        
    return data
