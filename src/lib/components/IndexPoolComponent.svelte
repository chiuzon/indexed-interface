<script lang="ts">
    import { INDEX_POOLS } from "$lib/constants";

    export let id = ''

    const indexPool = Object.entries(INDEX_POOLS).find((entry) => {
        return Object.keys(entry[1]).includes(id)
    })[1][id]

    $: poolName = indexPool.name || ''
</script>

<div class="flex flex-col border-neutral-700 border-2 rounded-t-md shadow-black hover:shadow-md hover:border-green-500 w-1/4">
    <div class="p-2 flex justify-between">
        <div class="text-xl font-bold">{poolName}</div>
        <div class="text-xl font-semibold text-neutral-500">4$</div>
    </div>

    <div class="px-3 py-2 border-l-2 text-sm font-semibold border-blue-400 mx-1 my-1">
        A higher risk/reward index of promising Ethereum protocols that are judged as having significant room to grow.
    </div>

    <div class="flex flex-col justify-center items-center font-semibold border-t border-neutral-600 p-1">
        <div>Total Value Locked</div>    
        <div>1.00.000$</div>
    </div>
</div>