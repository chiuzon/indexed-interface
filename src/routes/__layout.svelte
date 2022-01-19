<script lang="ts">
    import '$lib/styles/app.css';

</script>

<div class=" bg-zinc-900 border-b-white border-b w-full flex justify-center items-center px-5">
    <div class="p-5 font-bold text-xl">
        Indexed
    </div>
    <div class="flex flex-1 justify-around">
        <div class="font-semibold text-xl flex-1 flex justify-center">
            Products
        </div>

        <div class="font-semibold text-xl flex-1 flex justify-center">
         Portofolio
        </div>

        <div class="font-semibold text-xl flex-1 flex justify-center">
            Vote
        </div>

    </div>
    <div class="flex gap-2">
       <div class="font-semibold text-xl">
           Network
       </div>

       <div class="font-semibold text-xl">
           Wallet
       </div>
    </div>
</div>
<slot />