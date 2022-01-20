<script lang="ts">
    import { INDEX_POOLS } from "$lib/constants";
    import { findIndexPoolById } from "$lib/helpers/constants.helper";

    export let id = ''

    const indexPool = findIndexPoolById(id)

    $: poolName = indexPool?.name ?? ''
    $: poolDescription = indexPool?.description ?? ''
</script>

<div class="panel">
    <div class="p-2 flex justify-between">
        <div class="text-xl font-bold">{poolName}</div>
        <div class="text-xl font-semibold text-neutral-500">4$</div>
    </div>

    <div class="px-3 py-2 border-l-2 text-sm font-semibold border-blue-400 mx-1 my-1 break-words">
    {poolDescription}
    </div>

    <div class="flex flex-col justify-center items-center font-semibold border-t border-neutral-600 p-1">
        <div>Total Value Locked</div>    
        <div>1.00.000$</div>
    </div>
</div>
