import { faNotesMedical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useForm, useFieldArray, useWatch, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { addItem } from '../../../redux/itemsRedux';
import Button from '../Button/Button';
import SmallButton from '../SmallButton/SmallButton';
import styles from './ItemsForm.module.scss';

const ItemsForm = ({
  system,
  setSubmitedListError,
  id,
  items,
  setShowDraggAlert,
}) => {
  const dispatch = useDispatch();

  const [doubleNameError, setDoubleNameError] = useState(false);

  let itemNamesArray: string[] = [];
  items.map((item) => itemNamesArray.push(item.name));

  type FormValues = {
    item: { name: string; amount: number; unit: string; volume: number }[];
  };
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
    control,
  } = useForm<FormValues>({
    defaultValues: {
      item: [{ name: '', amount: 1, unit: '', volume: 0 }],
    },
  });

  const { fields, append, prepend, remove, update } = useFieldArray({
    name: 'item',
    control,
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        item: [{ name: '', amount: 1, unit: '', volume: 0 }],
      });
    }
  }, [isSubmitSuccessful, reset]);

  const onItemSubmit = ({ ...data }: FormValues) => {
    setDoubleNameError(false);
    setSubmitedListError(false);
    const doubleName = data.item.find((requestedItem) =>
      itemNamesArray.includes(requestedItem.name)
    );
    if (doubleName) {
      return setDoubleNameError(true);
    }
    data.item.forEach((element) => dispatch(addItem({ ...element })));
    setShowDraggAlert(true);
  };

  const ConditionallInput = ({ control, index, field }) => {
    const value = useWatch({
      name: 'item',
      control,
    });

    return (
      <Controller
        control={control}
        name={`item.${index}.volume`}
        render={({ field }) =>
          value?.[index]?.unit !== '' ? (
            <input
              type='number'
              min='0'
              {...register(`item.${index}.volume`, {
                disabled: false,
                valueAsNumber: true,
                required: {
                  value: true,
                  message: 'You must insert volume of this product',
                },
                min: {
                  value: 1,
                  message: 'There must be at least one product of this kind',
                },
              })}
            />
          ) : (
            <input
              type='number'
              min='0'
              {...register(`item.${index}.volume`, {
                disabled: true,
                valueAsNumber: true,
              })}
            />
          )
        }
      ></Controller>
    );
  };

  return (
    <Container>
      <form onSubmit={handleSubmit(onItemSubmit)} className={styles.form}>
        {fields.map((field, index) => {
          return (
            <section key={field.id}>
              <Row className={styles.item}>
                {doubleNameError && (
                  <p>You can't add item with the same name</p>
                )}
                <Col xs={6} sm={3} md={2} className='d-flex flex-wrap'>
                  <label>
                    <span>name</span>
                    <input
                      type='string'
                      {...register(`item.${index}.name`, {
                        required: {
                          value: true,
                          message: 'Name is required',
                        },
                      })}
                      placeholder='name'
                    />
                    <p>{errors.item?.[index]?.name?.message}</p>
                  </label>
                </Col>

                <Col xs={6} sm={3} md={2} className='d-flex flex-wrap'>
                  <label>
                    <span>amount</span>
                    <input
                      type='number'
                      min='1'
                      {...register(`item.${index}.amount`, {
                        required: {
                          value: true,
                          message: 'Amount is required',
                        },
                        valueAsNumber: true,
                        min: 1,
                      })}
                      placeholder='amount'
                    />
                    <p>{errors.item?.[index]?.amount?.message}</p>
                  </label>
                </Col>

                <Col xs={6} sm={3} md={2} className='d-flex flex-wrap'>
                  <label>
                    <span>unit</span>
                    {system === 'metric' && (
                      <select {...register(`item.${index}.unit`)}>
                        <option value=''>Select...</option>
                        <option value='millilitre'>millilitre</option>
                        <option value='litre'>litre</option>
                        <option value='milligram'>milligram</option>
                        <option value='gram'>gram</option>
                        <option value='kilogram'>kilogram</option>
                      </select>
                    )}
                    {system === 'imperial' && (
                      <select {...register(`item.${index}.unit`)}>
                        <option value=''>Select...</option>
                        <option value='fluid ounce'>fluid once</option>
                        <option value='pint'>pint</option>
                        <option value='gallon'>gallon</option>
                        <option value='ounce'>ounce</option>
                        <option value='pound'>pound</option>
                        <option value='stone'>stone</option>
                      </select>
                    )}
                  </label>
                </Col>

                <Col xs={6} sm={3} md={2} className='d-flex  flex-wrap'>
                  <label>
                    <span>volume</span>
                    <ConditionallInput
                      key={field.id}
                      {...{ control, index, field }}
                    />
                    <p>{errors.item?.[index]?.volume?.message}</p>
                  </label>
                </Col>
                <Col
                  xs={6}
                  sm={6}
                  md={2}
                  className='d-flex align-items-center justify-content-center'
                >
                  <SmallButton
                    type='button'
                    onClick={() =>
                      update(index, {
                        name: '',
                        amount: 1,
                        unit: '',
                        volume: 0,
                      })
                    }
                    className='red'
                  >
                    Reset
                  </SmallButton>
                </Col>
                <Col
                  xs={6}
                  sm={6}
                  md={2}
                  className='d-flex align-items-center justify-content-center'
                >
                  {' '}
                  <SmallButton
                    type='button'
                    onClick={() => remove(index)}
                    className='red'
                  >
                    Remove
                  </SmallButton>
                </Col>
              </Row>
            </section>
          );
        })}
        <Row className={styles.adding_items_buttons}>
          <Col>
            <Col xs={12} md={6} className='mb-2'>
              <SmallButton
                type='button'
                onClick={() => {
                  prepend({
                    name: '',
                    amount: 1,
                    unit: '',
                    volume: 0,
                  });
                }}
                className='mb-2'
              >
                Add form at the beginning
              </SmallButton>
            </Col>
            <Col xs={12} md={6}>
              <SmallButton
                type='button'
                onClick={() => {
                  append({
                    name: '',
                    amount: 1,
                    unit: '',
                    volume: 0,
                  });
                }}
                className
              >
                Add form at the end
              </SmallButton>
            </Col>
          </Col>
          <Col className={styles.big_button}>
            <Button type='submit' onClick={() => {}} className disabled={false}>
              <FontAwesomeIcon icon={faNotesMedical} className={styles.icon} />
              Add item(s)
            </Button>
          </Col>
        </Row>
        <Row className='d-flex justify-content-center mb-5'></Row>
      </form>
    </Container>
  );
};

export default ItemsForm;
