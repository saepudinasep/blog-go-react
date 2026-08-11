import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_ROOT + 'blogs';

        const response = await axios.get(apiUrl);

        if (response.status === 200) {
          if (response?.data.statusText === 'OK') {
            setApiData(response?.data?.blog_records);
          }
        }
      } catch (error) {
        console.log(error.response);
      }
    };

    fetchData();
  }, []);

  console.log(apiData);

  return (
    <Container>
      <Row>
        <Col xs='12' className='py-2'>
          <h1 className='text-center mt-5'>React Application with Go Fiber Backend</h1>
        </Col>

        {apiData &&
          apiData.map((record, index) => (
            <Col xs='4' className='py-5 box' key={index}>
              <div className='title'>{record.title}</div>
              <div>{record.post}</div>
            </Col>
          ))}
      </Row>
    </Container>
  );
}

export default App;
