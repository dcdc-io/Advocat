<script>
  import { Button, TextField } from 'smelte'
  import { useDatabase, signUp } from '../helpers.js'
  import * as yup from 'yup'
  
  let user = { 
    email: "",
    newPassword: "",
    newPasswordConfirm: ""
  }

  let isValid 
  let isSubmitting
  
  const users = useDatabase({name:""}).__remote
  const handleSubmit = () => {
    signUp(user.email, user.newPassword).then((result) =>
    {
      console.log(result)
      setSubmitting(false)
    })  
  }

  const validate = (data) => {
    console.log(JSON.stringify(user))
  }

  const schema = yup.object().shape({
    user: yup.object().shape({
      email: yup.string().required().email(),
      password: yup.string().required().min(6),
      passwordConfirm: yup.string().required().oneOf([yup.ref('password')],null)
    }),
  })
  const initialValues = {}
</script>

<style type="text/scss" global>
  .sveltejs-forms {
    background-color: lightgray;
    display: inline-block;
    padding: 1rem;
    .field {
      margin-bottom: 1rem;
      &.error {
        input {
          border: 1px solid red;
        }
        .message {
          margin-top: 0.2rem;
          color: red;
          font-size: 0.8rem;
        }
      }
    }
  }
</style>

<svelte:head>
	<title>advocat. register</title>
</svelte:head>

<h1>become an advocat.</h1>
<form on:submit|preventDefault={handleSubmit} on:changed={validate} on:invalid={validate} on:input={validate}>
  <TextField label="email" bind:value={user.email} placeholder="e.g. user@example.com" />
  <TextField label="password" bind:value={user.newPassword} type="password" />
  <TextField label="re-type password" bind:value={user.newPasswordConfirm} type="password" />



  <!-- <Select name="language" options={langOptions} /> -->  
  <!-- <Choice name="os" options={osOptions} multiple /> -->
  <!-- <button type="reset">Reset</button> -->

  <Button block type="submit" disabled={isSubmitting}>Sign in</Button>
  The form is valid: {isValid}
</form>