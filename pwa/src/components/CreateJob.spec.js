import CreateJob from './CreateJob.svelte'
import { Form } from 'sveltejs-forms'
import { render as _render, fireEvent, wait } from '@testing-library/svelte'

const render = async(component, options) => {
  const rendered = _render(component, options)
  await wait()
  return rendered
}

jest.mock('../helpers.js', () => {
  const PouchDB = require("pouchdb-memory")
  return {
    ...(jest.requireActual('../helpers.js')),
    useDatabase: ({ name }) => {
      return new PouchDB(name)
    }
  }
})

it('it works', async () => {
  const { getByText, getByTestId } = await render(CreateJob)

  const saveJob = getByText('Save Job')

  await fireEvent.click(saveJob)

  //expect(counter.textContent).toBe('2')

  // with jest-dom
  //expect(counter).toHaveTextContent('2')
  
})