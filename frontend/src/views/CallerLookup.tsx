import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { push } from 'connected-react-router'

import { fetchCallers, ICaller } from '../reducers/api'

import { ListGroup, Card, Accordion, ButtonGroup, Button } from 'react-bootstrap'

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
        <Accordion defaultActiveKey="0">
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="0">
                    Click me!
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                    <Card.Body>Hello! I'm the body</Card.Body>
                </Accordion.Collapse>
            </Card>
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="1">
                    Click me!
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="1">
                    <Card.Body>Hello! I'm another body</Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
        <Card>
            <Card.Body>
                <Card.Title>Callers</Card.Title>
                <ListGroup>
                    {props.callers.map((caller: ICaller) => {
                        return <ListGroup.Item action>{caller.name}</ListGroup.Item>
                    })}
                </ListGroup>
            </Card.Body>
        </Card>
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