<script>
    import FaqItem from "../components/FaqItem.svelte";

    const faqs = [
        {
            question: "How to use advocat.?",
            answer: `The advocat. is the platform that enables people to help eachother, communicate to eachother, and support eachother through organised, safe and verified transactions.
                     If you would like to help people who cannot leave their home, quarentined or in isolation please register as a volunteer and then you will be able to see all help requests in your local area and futher.
                     If you need help or have an inquiry, please post your message and your postcode, help will be on your way soon. Please do not post any personal data or specific information about your identity.`
        },
        {
            question: "What kind of requests can I make?",
            answer: `The advocat. is the platform that enables people to help eachother, communicate to eachother, and support eachother through organised, safe and verified transactions.`
        },
    ]
</script>

<svelte:head>
	<title>FAQs</title>
</svelte:head>

<h3>FAQs</h3>

{#each faqs as faq}
        <FaqItem question={faq.question} answer={faq.answer}></FaqItem>
{/each}