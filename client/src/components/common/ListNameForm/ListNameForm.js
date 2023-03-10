import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import SmallButton from '../SmallButton/SmallButton';
import styles from './ListNameForm.module.scss';

const ListNameForm = ({
  submitedName,
  setSubmitedListName,
  setSubmitedListNameError,
}) => {
  const [listName, setListName] = useState('');

  const [listNameError, setListNameError] = useState(false);

  const handleListNameSubmit = (e) => {
    e.preventDefault();
    if (listName === '' || listName.length > 30) {
      setListNameError(true);
    } else {
      setListNameError(false);
      setSubmitedListName(listName);
      setListName('');
    }
  };

  const handleInputChange = (value) => {
    setListName(value);
    setListNameError(false);
    setSubmitedListNameError(false);
  };

  const handleEditButton = () => {
    setListName(submitedName);
    setSubmitedListName(listName);
  };

  return (
    <Container>
      <div className={styles.form_section}>
        <Row>
          {submitedName && <h1>{submitedName}</h1>}

          {!submitedName && (
            <form
              onSubmit={(e) => handleListNameSubmit(e)}
              className={styles.form}
            >
              <Row className='align-items-center mb-2 '>
                <Col sm={12} md={6} className={styles.left_column}>
                  <input
                    type='text'
                    value={listName}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder='Insert list name...'
                  />
                </Col>
                <Col sm={12} md={6} className={styles.right_column}>
                  <SmallButton type='submit'>Submit list name</SmallButton>
                </Col>
              </Row>
              {listNameError && (
                <p className={styles.p}>
                  List name is required and should have max 30 sings
                </p>
              )}
            </form>
          )}
        </Row>
        <Row className='d-flex justify-content-center'>
          {submitedName && (
            <SmallButton onClick={() => handleEditButton()}>
              <FontAwesomeIcon icon={faEdit} className={styles.icon} />
              Edit name
            </SmallButton>
          )}
        </Row>
      </div>
    </Container>
  );
};

export default ListNameForm;
