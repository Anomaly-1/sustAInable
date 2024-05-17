<template>
    <div class="w-screen h-screen flex flex-col items-center justify-center">
      <h1 class="text-3xl font-bold mt-10">Google Map</h1>
      <GoogleMapLoader/>
      <button class="bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 mb-6" @click="navigateTo('/dummycomponents/analyze')">
        <span class="">Next Page</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path fill-rule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
</template>
