<script>
    import FaqItem from "../components/FaqItem.svelte";
    import faqs from "../../static/faqs.js";
</script>

<svelte:head>
	<title>FAQs</title>
</svelte:head>

<h3>FAQs</h3>

{#each faqs as faq}
    <FaqItem question={faq.question} answer={faq.answer}></FaqItem>
    <br />
{/each}