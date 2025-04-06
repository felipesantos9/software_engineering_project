import { useEffect, useState } from 'react';
import HeaderMain from '../../components/headerMain/headerMain';
import './tripsRegisterPageStyle.css';
import TrisInput from '../../components/inputTrips/tripsInput';
import { tripSchema } from '../../schemas/trip';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast, { Toaster } from 'react-hot-toast';

function TripsRegisterPage() {

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<TripInterface>({
        resolver: zodResolver(tripSchema),
    });

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            for (const key in errors) {
                const message = errors[key as keyof TripInterface]?.message as string;
                toast.error(message, { duration: 2000 });
            }
        }
    }, [errors]);


    return (
        <>
            <Toaster />
            <HeaderMain />
            <div className='container-container'>
                <div className='container'>
                    <h2 className='title'>Registro de viagens</h2>
                    <p className='description'>Insira informações sobre suas emissões de carbono.</p>
                    <form className='trip-form'>
                        <h3 className='title'>Transporte de cargas</h3>
                        <p className='description'>Registre as emissões relacionadas ao transporte de cargas</p>
                        <p className='type'>Tipo de transporte</p>
                        <div className='container-form'>
                            <div className="type-radios">
                                <label>
                                    <input type="radio" name='type' />
                                    Logística e distribuição
                                </label>
                                <label>
                                    <input type="radio" name='type' />
                                    Deslocamento de funcionários
                                </label>
                            </div>
                            <TrisInput
                                inputId="weight_value"
                                labelTitle="Peso total"
                                placeholderText="0.00"
                                typeInput="number"
                                register={register}
                                unit={true}
                            />
                            <TrisInput
                                inputId="distance_value"
                                labelTitle="Distância total"
                                placeholderText="0.00"
                                typeInput="number"
                                register={register}
                                unit={true}
                            />
                            <TrisInput
                                inputId="trip_date"
                                labelTitle="Data da viagem"
                                placeholderText="dd/mm/aaaa"
                                typeInput="date"
                                register={register}
                                unit={false}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default TripsRegisterPage;

