<script lang="ts">
    import IndexPoolComponent from "$lib/components/IndexPoolComponent.svelte";
    import { FEATURED_INDEX_POOLS, INDEX_POOLS } from "$lib/constants";
     
</script>


<div class="relative">
    <img src="https://indexed.finance/static/media/header_splash_background.ae73f7bb.png" />

    <div class="absolute inset-0 flex flex-col items-center">
        <div class="flex p-5 items-center">
            <div>Logo</div>
            <div class="text-3xl font-bold">Indexed</div>
        </div>

        <div class="text-2xl">
            Gain exposure to passively-managed crypto index portfolios represented by a single token.
        </div>
    </div>
</div>

<section>
    <h1>INDEX POOLS</h1>

    <div class="flex flex-wrap  gap-6 py-5 w-full">
        {#each FEATURED_INDEX_POOLS as indexPoolId }
            <IndexPoolComponent id={indexPoolId} />
        {/each}
    </div>
</section>