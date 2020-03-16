import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { push } from 'connected-react-router'

import { fetchCallers, ICaller } from '../reducers/api'

import { ListGroup, Card, Accordion, ButtonGroup, Button } from 'react-bootstrap'

const populateCallerDetails = (caller:ICaller) => () => {
    console.log("poplating")
}

const View = (props: any) => {
    useEffect(() => {
        props.fetchCallers()
    })
    return <>
        <ButtonGroup aria-label="Basic example">
            <Button variant="secondary">Recent</Button>
            <Button variant="secondary">Local</Button>
            <Button variant="secondary">All</Button>
        </ButtonGroup>
        <Accordion>
            {props.callers.map((caller: ICaller, index:number) => {
                return <Card>
                <Accordion.Toggle as={Card.Header} eventKey={index.toString()} onClick={populateCallerDetails(caller)}>
                    {caller.name}
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={index.toString()}>
                    <Card.Body>Hello! I'm the body</Card.Body>
                </Accordion.Collapse>
            </Card>
            })}
        </Accordion>
    </>
}

const mapStateToProps = ({ api }: any) => {
    return ({
        callers: api.callers,
        fetchingCallers: api.fetchCallers
    })
}

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        fetchCallers,
        changePage: () => push('/about-us')
    }, dispatch)
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(View)