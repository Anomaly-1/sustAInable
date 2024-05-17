<template>
  <div class="h-screen flex items-center justify-center bg-white-900 text-black relative overflow-hidden overflow-y-auto place-content-center"> <!-- full screen -->
    <router-link to="/" class="absolute top-4 left-4">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
      </svg>
    </router-link>
    <!-- Upload card -->
    <div v-if="!processing && !aiOutputs.length" class="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
      <div class="relative rounded rounded-md">
        <label for="imageInput" class="bg-lime-50 w-full md:w-100 lg:w-140 md:h-80 max-w-3xl mx-auto border-white rounded-lg overflow-hidden shadow-lg flex justify-center">
          <div class="w-full p-6 space-y-6 flex flex-col justify-between">
            <div>
              <h1 id="title" class="text-xl md:text-3xl font-bold text-black mb-2 outfit-outfit mt-6 averia-libre-bold">Instructions</h1>
              <p class="text-gray-600 mb-4 outfit-outfit">Drop a picture of a single piece of trash through the button below.</p>
            </div>
            <div>
              <div class="bottom-0 left-0 flex items-center justify-center px-4 py-2 bg-yellow-300 text-black rounded-lg focus:outline-none focus:ring focus:ring-blue-200 hover:bg-black hover:text-white hover:border-2 hover:border-white cursor-pointer" @mouseover="isHovered = true" 
                @mouseleave="isHovered = false"
              >
                <span>{{ uploadText }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" :stroke="isHovered ? 'white' : 'black'" class="w-6 h-6 m-2 transition-colors duration-300">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                </svg>
                <input type="file" @change="uploadImage" id="imageInput" class="hidden" />
              </div>
            </div>
          </div>
        </label>
      </div>
    </div>
    <!-- Loading card -->
    <div v-if="processing" class="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
      <div class="text-white averia-libre-light-italic">Loading...</div>
    </div>
    <!-- Output sections -->
    <div v-if="aiOutputs.length" class="h-1/6 sm:h-1/6 md:h-1/3 lg:h-1/2 w-auto top-0 fixed mt-20">
      <div class="text-center text-lg font-bold mb-4 averia-libre-regular">
        Great job on taking a step towards sustainability!
      </div>
      <svg class="w-full mb-8" width="354" height="74" viewBox="0 0 354 74" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <rect width="354" height="74" fill="url(#pattern0_906_997)"/>
        <defs>
        <pattern id="pattern0_906_997" patternContentUnits="objectBoundingBox" width="1" height="1">
        <use xlink:href="#image0_906_997" transform="scale(0.00282486 0.0135135)"/>
        </pattern>
        <image id="image0_906_997" width="354" height="74" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWIAAABKCAYAAACB1F6VAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAABEwSURBVHgB7Z0xbBvXGcefKFo6S7JEyHZM1XLCFEGtwYAFNIDVLhbSAPbUGMjQbg6QIaPHDh06deiYMUMHD0EToB1cNIAFNIUNZLCLBJCLBJAKpKET2aJq1aBtyaZkSe7/f3yPfjpR0pEUyZP4/wH0PR7vztQd73/f+973fa/LeORyucza2tpEKpU6vbGxkTHVKeI1PTc3d9MIIYRomC7XOHny5ERXV9d5NIM4O7548aJw6NChq/l8vmSEEELUTZr/jIyMjEGEL7iVENk8FrN4RUU2wHbnsMxgmV1dXeU+14wQQoi66bLuiMto0xVRQvvTQqGQ32knWM/vQYhfYxuiPXXv3r1bRgghRF2k1tfXJ01ZhENR3U2ECVwSn5iyr9jQnQExj+XOEEIIsZUUxNdZtnlYttNxdqJfGJazc0kEpVIpa4QQQtRFylhr2JR9wtty/Pjx7Ojo6GQG8H0QBAX3WTqdzhkhhBB1kfLaO0Y/9PT0vIPF+cOHD0/yPa3iVCpVNEIIIRoiFXfD7u5u+YGFEKIJpL12LKGFIL8GF8VFtndI+hBCCBETWsShSwKiuuOAGz6/Y5sU33P2RUpLS0uxBvmEEEJsJdXV1XWXDVi6p3facG5u7gbD25hRZ1eVGGnBuOMiMEIIIeqCCR3jEFMOxBksr8aJIxZCCLF30DUxY6x7Ip1Ov6PkDCGEaC3d8CqsHTlyZB0uijfwPoBVPPDkyZNZI4QQoiV08x8I7xzE+HWIcVjMZ3BwcBzvV7C+YIQQQjSVShlMuiSeP39+mULsfc6kjQIG5R7Z97SYi/Pz89eNEEKIPaHbNeiigAX8VV9fXxfElyFq9BWnIcJsZ+3rGD4bxetOCRghhBAN01VtJUtjwjrOQYRZp3jT4N36+vp3hUJBs3MIIYQQQoiDQZcRiQa9kxxrRqNnMuSnlNuCS0WsW8Dn+d7e3rymrRJifyIhTjB29pQrcbeHWM9CmGf8utI2LjyASCv7UYiEIiFOMLSG7TRWYeF+l45OYAVnOKjqpqyKUMT29OMH3oSwmn1biIQiIU4wtGYhxL9he6dZs7PZbA6fncU2OfOy0P92FCHiU/Pz8zNGNAXXCzHVr0VRvRMRRUKccEZGRi50d3dPsA23w/T9+/e3nTXbxoKPu5m23XqKuI1+8YXhhqzjxqH7iAs83HK4PieYFGVilJTlNUGP5tGTJ0+uq2iWkBAnHIrr6urqJdy0YXW8OIWZRkdH6VeOWmO82VnKlCIdxD3WQYHTfGFxfi9mHbc9lQlck7N7UZM7nU7/QQOtnU3aiMTCeQJtxESvWwfr+AIWH1Xb3grEB8aKMPa9he3H7PuwjjSONQ0xGkc7wGf0H+fNAQe9Cp6D8/YtH2h1CbGLYME5Dv3yEGH/45K1cgtYz0zUErbdYuninGfZO2H9b/dwRS+G3081vTsYCXFCsRETl3Fzc8CNN/0Mblwm2GQhLBe3STN3ght2fbHNFJpT8CFPwuoKB+2wnm6O0PrCsXKmA8B5cyJcXF5evlbr/lEBdnAAlaGDeM0+ePAgbl2WvDsmjhcKcTXBFp2FhDih8MY31oUAwbwF3/DUyZMnP6AQw6o6BzE2UTFG97aAbSg0gd/9hvvhBsQ4zzKnpizUzofZEd1hVz8F5/RuLf5Y28OgAJ/zVpfYq4AVO1uvW4cWuqsBTvwZ0UVn0m1E4qAAwAJ+l20O0EFUP2P76NGj3+I9u7EBa36wSh6Ws37dD1bMYzW96DGXlpaKw8PDs25/u3oN+39z0OuGuMqC+Fuzceuk2B7J+2i+YVeV8P6Lnp6ev3z//fezPJ+mTjKZzJv8L9jGMTlo+q0RHY2EOIH09/efgXBQMGnFTbmbHsZciWLKEXp8PoBVAYRhAoJsHj9+fHe343J/ljd1xwZp7D8WFfODBh5gdB/k0FyEC+F2nH1wDViJ8BjbdEHApfHx4uLiLItjmQbBNVzEA3EF3+k2rOqvjOh4FDWRQLyohyKspQ+rbeP5fR1hEoefVRfF+Z3tsSm8zjIuQuyvKoyqDNw7DAEMXQe7hQw2gud7Lqi0bGcjizhh2DCr0GJlqNV2xfkhnHlYVnc8VwMH9ca2K+pvRZgRFQP22J9BBBZgDedM2bI+8JZxXOA6uGjsgxAPtqtmj6EA4xpdwrXjg5Quk1Fcy9t7YW2L/YmEOEFQLHFz/sq+pQjsaInR1QCXxG3c1I/sgFRUkLswsLdEcYW48NhhYgj9krDAblPMbf3pnJEYV8C5C61hDsrh/O6Z/5bXF9fkIq4DQxBd/HEJA39/x7Xe1bUkDi5yTSQIPxEDIvlhra4C26U+byLJHLB87zx79uwGtDiAr9NEQ60ibo4i2h91coIBrsPvuGS0yg8//DBlGsDW9uYDbgy9kE3hb3wgBkFwW8kcQhZxQvBdEkzEwMDQN6ZG6I6oYiEzjjbLQT0IwqHDhw8vRgU+ahnDYluLM/h3UHFRFmgew6Dd/3B+FmvZn66HgYGB8aGhoUlav3ZiXj/lnIN/V/dq8E/sf2QRJ4BIucttB+hqxSsGNB75iEI8C8t3mrHHbqWLU6ZQNMM3GheXQszvgofHrVanYfO84dxc9lYV8V0WmCSD9ZseYvh+ga3jEdhzd8JUrzXBY8z48cf8O1dWVnLorRQ0UNrZKKEjAbhSl4TRC2aPsDd8Hjf8TVjZ5z1BDtOdmagAS5wJCncpMsYKCNpt6yrjYTCB73XBfg9a8y9Mi9Owed7wPaa8EqIZO3fjaXy3Tdsy69HB7+vjMu/QvFvtYcJkESbnwOrOQ4fb9uAT7UdC3GasSyLsttJn2AzLyJZdvEZB5lyEplxzws3WzbRnptqedtuzwLxpA64wj3tPIUPXPlbc717DzEScrxlbB+JsjKpqrDURzpiCh0cePZGZ3Xy/tKQp3vbYooORELcR65I4a98Wmz0pqxVkxhlPRyaIHbLCzBH8GwsLCy0vQGPPRWXAEO1rSagMZ63iElwSH1JYGX3if463JQ22iUaRELcRW0/CVUpraHS+VnxRNgnAnouQpIgwo/4gwKH/19abuBntsWzXgbF1isOX9SNnPF9yL/7ewLo7jNm9mL844EiI24RvDTN7q94ZM9yAT63724G8iXYMhlXDhXbRHZGUGsnWV3zXTkc1gXNdNdTMzsiRxfUccwN2aFfcGM6P7HzI1h2x6Ri0tDVg17lIiNuEbwE+ffo0tkvCzQiBGz30WbKUIgZ8MvCv1jTjBkR4kuLXjsGwKLYkpLMK75gEget0w0ZQVKxi95l9mE7YB6ob6DT1gAG7HHQ4Eb0T0XokxG0gag3HsYRodUEUfh2tieuAAKyYmNjwsPA4EPG2W2GwyrPOQlxeXs6bBLGdVWyjO1xURYXBVzZM9kx5OXhiwwznjOkZwEZ49fSVt3n8X2OW8Pr35ykz84/yLYgH4gkjOhYJcRuoxxrm6H2VGZvZTWZ5xmkIRuxZJ+jKgACHbezb9sQNm3UWFrNPYvccD0vOdMJzTzfQ5KlTp7J+llzQt2F+8jZev9gwx3K7H2/wlfLrR2c2zOJ/8Mqn+LczOqOl4wQiOUiIW0w91jBh1pvr9jL9uZHRenS1x9yxent786bN2CQILhPpI6X/Ha4ffrcM43599wPF9K0ra2bgFVMXwz82EOKwmWFPRREYnUnKiJZSr28Yol3JgAuCINPIDeusOU6/1O4bH+JTScVuV/xyTLb4rsfeWjO//H39IkyO5V7Oe1cqlbJGdCQS4hZC0YEI1mwNEwyucSAnFE075VFdsDCQseFSSRA+m2ASsrq6mtgpg3DON7l+6AOevLJhGmXQ8wxz0NWIjkRC3ELgknAlLmuyhom1XF2WWYYTiJo6gIvDpTkXdyoi3ypsoSFSrGECzpbD84+HaMWf/vP3Gxfh0lMM1n2uW1BIiFuGb4nWm8o8Nzd3w9aEMHYC0bFa9meYmHNLwEVSV9zyXuO5SfIm4dheScjid6Yh7n+dMn++kjb5f768BRU50blIiFuETZUlDaUyQww+NdZFgRv3XC37+v7pZ8+etaWGg0/EP5z4spvw4VYenv/6W33j3BTgv/42Hb4YwuaDh5F8xB2KoiZagF/Yh/PKmTpxc5yZnYvPbLfvmIsdrtU/3SxWVlYyLowuyf5hB6e9xzkM5/pbXTLmyz+lTe5nG5X44O14mIcF/W3K5G+ZMFTNx/ZwWAEv5xViEh2GhLjJRIvZ1OqX9WrzUkj9rmtpeXk59qSWrrQk96vVP90sYNFXBqf6+/vpIzZJxiZy3MS1CM/ll5+kwlc9WAG+zd8DrvE4rk8O7wOmniclxVu0Dglxk/HdAbAAP427nxNgm1YbeLGrTOC4xSl2OGddnGNFSm3eSmLSBL4SrfzEx9CyPCZ880Ow5Cdq3DUUX5bI9IvDWyptHDdr2pxyLlqPhLiJWDEN6/wyZjduVMDx48ezNsJi0/Q6LDJOAcagXWzBilrkzS61WQs4J0XnmoDvu2Z3S7vo7e29yQI/5qW7qWArq1XAukf8+yC8BS6ZOLNdzDYr4b366qusZZyRn7gzkRA3EZtK7IrBxC5mA7G96EokWgG+WW93tVmzf+wFEKeCm/Gip6eHApR4PzHxXBRutueZWgouVYPCjUUGwj1kRMchIW4itpsZUksqMa1nFmtnicqFhYW6oxtaMftHrUTmoxuKloPcL9C3a2fN3rFEphBxkBA3Ec795oSmFh8o/ZBYxC7iUw0bY5w4lwSseyainI3W5E1a1bU4+CUyWQwIy+umDljJzcVT05VhxIHBPqwz+K0UYIwV/cl6fbqNaBr9/f1pl8mGrvfY8PDwQiusUluz+F1TDnMrwSXxxxIwCWBoaIjn4xjbdvDqa1jIny8uLu47AcJ5LR45cuR13mj4O0b7+vrucl3c/RmOiP0voflTu4rX6lpSrpVoDJtAxbGeHH4fZ9DTfXNwcHAcujCCB3jBv84S4ibCmxI3Z5dN4w1wIXgRFrB+0TSRgYGBD8zLgaTPMEiYNwkBwpNmKB7bWK7h+33D6eT3q/gcPXqUE5zy4cKHLm+42Z3+Frpm8Bt4M5PJvI392GNxA7JFWNUfP3z4sKm/DdE6WCER1/iM2Rz3H+A3koVhNgFRNo8fPw4Tmfang26fkc1mJ/EEdGFo15pZ4wF+YXb9w4w7+oWTFCXhQHftvWhtZZyXKeuS2XfQteBii0GRg6Ls+dgplCi0jILhnHUZO2O2f2NWwhHlYz64MBLKDkiP+799Jlfdv3//moS4RdBdAD8oraES/aTM0ILPaJoxTWaP8KejZ7cfwvaRSSj24cRKdKFFyAFK/CBjx1knDfv3OJ88CwQVd8mUkwB3KDaklGMLrtcqIW41vlhaikx75mBVI/7jyHErVplJOMwkg4Dl8H0TkXbdCBExrgZjhRc444ey5zobGz10xZRdljMS4hbDp+Hz588vwVpiuvKmJABYyow1nqllRmZ7QSeNdUeYfSTCBxE+WOADpKuCvsB5TkVFH3gjM6qIg4dvFUuI24gV5JytyralIDhTYWk9sYtrM7N4EzP8pej2N+XZnDcN+EiEhUg29Bfjfq5kzso1kRBoRR06dOisnUCyrlRfZuCxCJBEWIhkUqX3WhlQlxAnDCZiwM/4GqzgkWruiyqEgz5JjI4QQpShCKMHfNkfwMX76y5zVkKccHgBYemybm/AOc0YAsX1zNpjto4GfYRIPqdOnbrk5qtk73V1dXXKLwKmFOeEYwd4lPYqxD7GF+F79+5tKb6lqZKEEKKJMNXZteFyrFrES0IshBDN5WVNie7uqhPESoiFEKKJsOIaXBJuctwJm/q+CQmxEEI0GZZMtc2gVCptSX1X9TUhhGgyrMTY399PS3h5fn7+i+jn/wfv/gH7i0pD3gAAAABJRU5ErkJggg=="/>
        </defs>
      </svg>

      <div class="output-section bg-lime-50 w-80 sm:w-80 md:w-180 lg:w-full md:h-80 max-w-3xl mx-auto border-white rounded-lg overflow-auto shadow-lg flex justify-center items-center snap-y mt-4"> <!-- Invisible scroll -->
        <div class="text-black p-6 mb-auto"> <!-- Text color -->
          <div class="mb-16 snap-start "> <!-- Added margin to prevent overlap -->
            <h2 class="text-xl font-bold mt-auto averia-libre-bold">Recycle</h2> <!-- Recycle title -->
            <p class="averia-libre-light" v-html="aiOutputs[0]"></p>
          </div>
          <div class="mb-16 snap-start">
            <h2 class="text-xl font-bold averia-libre-bold">Reuse</h2>
            <p class="averia-libre-light" v-html="aiOutputs[1]"></p>
          </div>
          <div class="snap-start">
            <h2 class="text-xl font-bold averia-libre-bold">Reduce</h2>
            <p class="averia-libre-light" v-html="aiOutputs[2]"></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


  <script>
  import { GoogleGenerativeAI } from "@google/generative-ai";

  export default {
    data() {
      return {
        uploadText: 'Upload',
        isHovered: false,
        aiOutputs: [],
        processing: false
      };
    },
    methods: {
      async uploadImage(event) {
        this.uploadText = 'Loading...';
        let file = event.target.files[0];

        if (file) {
          const reader = new FileReader();

          reader.onload = async (event) => {
            const dataUrl = event.target.result;
            const base64String = dataUrl.split(",")[1];

            const generativePart = {
              inlineData: {
                data: base64String,
                mimeType: file.type
              }
            };

            this.processing = true; // Start processing
            await this.run(generativePart);
          };

          reader.readAsDataURL(file);
        }
      },
      async run(genpart) {
        const genAI = new GoogleGenerativeAI(googlegeminiproapikey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

        const prompts = [
          "Provide detailed RECYCLING information related to the object in the image.",
          "Suggest ways to reuse the object in the image.",
          "Give tips on reducing waste related to the object in the image."
        ];

        const responses = await Promise.all(prompts.map(async prompt => {
          const result = await model.generateContent([prompt, genpart]);
          const text = result.response.text().replace(/\*/g, "<br/>*").replace(/-/g, "<br/>-");
          return text;
        }));



        this.aiOutputs = responses; // Set all outputs at once
        this.processing = false; // Finish processing
        this.uploadText = 'Upload';
      }
    }
  };
  </script>

<style scoped>
/* Add any additional styling here */
.outfit-outfit {
  font-family: "Outfit", sans-serif;
  font-optical-sizing: auto;
  font-weight: 600;
  font-style: normal;
}

#title {
  font-weight: 600;
}

.floating-card {
  animation: floatAnimation 3s infinite alternate cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes floatAnimation {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-20px);
  }
}

/* Style scrollbar */
.bg-lime-50 {
  scrollbar-width: thin; /* For Firefox */
}

.bg-lime-50::-webkit-scrollbar {
  width: 6px; /* Width of vertical scrollbar */
}

.bg-lime-50::-webkit-scrollbar-track {
  background: transparent; /* Background color of the scrollbar track */
}

.bg-lime-50::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3); /* Color of the scrollbar thumb */
  border-radius: 3px; /* Radius of the scrollbar thumb */
}

</style>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Averia+Libre:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap');
</style>