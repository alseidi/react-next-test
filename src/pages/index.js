import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Button, Form, ListGroup, Col, Row, Container, Jumbotron } from 'react-bootstrap';
import styles from '../styles/Home.module.scss';

import engine from './engine';

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [engineType, setEngineType] = useState('at_t');
  const [result, setResult] = useState([]);
  const [lastWords, setLastWords] = useState([]);
  const [isPronounce, setIsPronounce] = useState(false);

  useEffect(() => {
    const lastTenWords = localStorage.getItem('lastWords');
    if (lastTenWords) {
      const parsedWords = JSON.parse(lastTenWords);
      setLastWords(parsedWords);
    }
  }, []);

  const handleStopPronounce = () => {
    speechSynthesis.cancel();
    setIsPronounce(false);
  };

  const handleSubmit = () => {
    if (!inputValue) return;

    const lastTenWords = [inputValue, ...lastWords].slice(0, 10);
    localStorage.setItem('lastWords', JSON.stringify(lastTenWords));

    handleStopPronounce();
    setLastWords(lastTenWords);
    setResult(engine(engineType, inputValue));
  };

  const handleChange = (e) => {
    const { type, value } = e.target;

    if (type === 'radio') {
      setEngineType(value);
    } else {
      const formatted = value.replace(/[^A-Za-z\s]/gi, '').replace(/\s\s+/g, ' ');
      setInputValue(formatted);
    }
  };

  const handlePronounce = () => {
    if (isPronounce) {
      handleStopPronounce();
      return;
    }

    try {
      if (!result?.length) {
        throw new Error('No result here');
      }

      setIsPronounce(true);

      result.forEach((item) => {
        const utterance = new SpeechSynthesisUtterance(
          `${item.slice(0, 1)} as in ${item}`
        );
        speechSynthesis.speak(utterance);
      });
    } catch (error) {
      setIsPronounce(false);
      console.error(error);
    }
  };

  return (
    <>
      <Head>
        <title>Spell Me</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
          integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
          crossOrigin="anonymous"
        />
      </Head>

      <Container className={styles.root}>
        {lastWords?.length !== 0 && (
          <Row className="mb-5">
            <Col md={12}>
              <h4 className="mb-3">Last 10 words</h4>
            </Col>
            <Col md={12}>
              <Jumbotron className="p-3">
                <ListGroup horizontal>
                  {lastWords.map((item, idx) => (
                    <ListGroup.Item key={idx}>{item}</ListGroup.Item>
                  ))}
                </ListGroup>
              </Jumbotron>
            </Col>
          </Row>
        )}
        <Row>
          <Col md={2}>
            <Form.Group>
              <Form.Check
                value="at_t"
                checked={engineType === 'at_t'}
                onChange={handleChange}
                type="radio"
                label="AT&T"
                name="engineType"
                id="at_t"
              />
              <Form.Check
                value="nato"
                checked={engineType === 'nato'}
                onChange={handleChange}
                type="radio"
                label="NATO"
                name="engineType"
                id="nato"
              />
            </Form.Group>
          </Col>
          <Col>
            <Row>
              <Col md={12}>
                <Form.Group controlId="formWords">
                  <Form.Control
                    onChange={handleChange}
                    value={inputValue}
                    type="text"
                    placeholder="Enter words"
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <ListGroup>
                  {result.map((item, idx) => (
                    <ListGroup.Item key={idx}>
                      {item === ' ' ? <br /> : `${item.slice(0, 1)} as in ${item}`}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Col>
            </Row>
          </Col>
          <Col md={4}>
            <Button
              onClick={handleSubmit}
              className="mr-3"
              variant="primary"
              disabled={!inputValue}
            >
              Submit
            </Button>
            <Button
              onClick={handlePronounce}
              variant="secondary"
              disabled={!result || !result.length}
            >
              {isPronounce ? 'Stop Pronounce' : 'Start Pronounce'}
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
}
