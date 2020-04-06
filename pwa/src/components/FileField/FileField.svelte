<script>
import { onMount } from "svelte"
import { Card, Button, DataTable } from "../../../node_modules/smelte/src"

let thisDropzone
let dzContainer
let template

export let method = "post"
export let url = "#"
export let files
export let label
export let autoProcessQueue = false

onMount(async () => {
    const Dropzone = await import("dropzone")
    thisDropzone = new Dropzone.default(dzContainer, {
        autoProcessQueue,
        addRemoveLinks: true,
        dictRemoveFile: "remove",
        previewTemplate: template.innerHTML,
        method,
        url
    })
    thisDropzone.on("addedfile", file => {
        files = thisDropzone
    })
    thisDropzone.on("removedfile", file => {
        files = thisDropzone
    })
})
</script>

<div style="width: auto; min-height: 50px; position:relative;" bind:this={dzContainer}>
    <slot name="backdrop">
        <div style="position: absolute; width: 100%; height: 100%; z-index:-1;">
            <p style="position: absolute; transform: translate(-50%, -50%); top: 50%; left: 50%;">drop or tap to upload files</p>
        </div>
    </slot>
    <label>{label}</label>
    <span bind:this={template} style="display:none;">
        <slot>
            <div class="dz-preview dz-file-preview">
                <div class="dz-details">
                    <div class="dz-filename"><span data-dz-name></span></div>
                    <div class="dz-size" data-dz-size></div>
                    <img alt="thumbnail" data-dz-thumbnail />
                </div>
                <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
                <div class="dz-success-mark"><span></span></div>
                <div class="dz-error-mark"><span></span></div>
            <div class="dz-error-message"><span data-dz-errormessage></span></div>
            </div>
        </slot>
    </span>
    <input hidden name="file" type="file" />
</div>