<script lang="ts">
    export let classNames = '';
    export let bodyClassNames = ''
</script>

<div class="group inline-block relative {classNames}">
    <slot name="dropdown-head"></slot>
    <div class="origin-top absolute z-10 p-1 mt-4 bg-zinc-700 -scale-y-0 opacity-0 delay-100 
                group-hover:scale-y-100 group-hover:opacity-100 group-hover:block {bodyClassNames}">
       <slot name="dropdown-body"></slot>
    </div>
</div>