<script lang="ts">
    import '$lib/styles/app.css';

</script>

<div class=" bg-zinc-900 border-b-white border-b w-full flex justify-center items-center px-6 py-3">
    <div class="pl-5 font-bold text-lg uppercase">
        Indexed
    </div>
    <div class="flex flex-1 justify-around">
        <a href="/" class="font-semibold text-lg flex-1 flex justify-center uppercase hover:text-blue-300">
            Products
        </a>

        <a href="/" class="font-semibold text-lg flex-1 flex justify-center uppercase hover:text-blue-300">
         Portofolio
        </a>

        <a href="/" class="font-semibold text-lg flex-1 flex justify-center uppercase hover:text-blue-300">
            Vote
        </a>

    </div>
    <div class="flex gap-2">
       <div class="font-semibold text-lg">
           Network
       </div>

       <div class="font-semibold text-lg">
           Wallet
       </div>
    </div>
</div>

<div class="w-full flex justify-center">
    <div class="bg-foreground w-4/5 rounded-2xl p-5 border-white border shadow-2xl shadow-foreground mt-16 h-screen max-h-max">
        <slot />
    </div>
</div>