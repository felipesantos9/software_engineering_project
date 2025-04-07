import { useEffect, useState } from 'react';
import HeaderMain from '../headerMain/headerMain';
import './tripsRegisterModalStyle.css';
import TrisInput from '../inputTrips/tripsInput';
import { tripSchema } from '../../schemas/trip';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast, { Toaster } from 'react-hot-toast';
import { tripRegisterRequest } from '../../services/api/tripsRequest';
import { Dialog } from "radix-ui";
import { RxCross1 } from "react-icons/rx";

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

    const keysMethods: Record<TransportMethod, string> = {
        plane: "Avião",
        truck: "Caminhão",
        train: "Trem",
        ship: "Navio",
    };

    const registerFunc = async (content: TripInterface) => {
        console.log("testetestests")
        const data = await tripRegisterRequest(content);
        if (data) {
            toast.success("Registro realizado com sucesso!", {duration: 2000})
        } else {
            toast.error("Falha ao criar o registro. Tente novamente!", {duration: 2000})
        };
    };

    return (        
        <Dialog.Portal>
            <Dialog.Overlay className="DialogOverlay" />
            <Dialog.Content className="DialogContent">
                <Dialog.Title></Dialog.Title>
                <form className='trip-form' onSubmit={handleSubmit(registerFunc)}>
                    <div className='header-group'>
                        <div>

                            <h3 className='title'>Transporte de cargas</h3>
                            <p className='description'>Registre as emissões relacionadas ao transporte de cargas</p>
                        </div>
                        <div>
                            <Dialog.Close asChild>
                                <button className="IconButton" aria-label="Close">
                                    <RxCross1 />
                                </button>
                            </Dialog.Close>
                        </div>
                    </div>
                    <p className='type'>Tipo de transporte</p>
                    <div className='container-form'>
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
                        <div className='input-group-select'>
                            <label className="label-style">Método de transporte</label> <br />
                            <select className="method-select-style" name='transport_method'>
                                {Object.keys(keysMethods).map((option, index) => (
                                    <option key={index} value={option}>
                                        {keysMethods[option as TransportMethod]}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <TrisInput
                            inputId="trip_date"
                            labelTitle="Data da viagem"
                            placeholderText="dd/mm/aaaa"
                            typeInput="date"
                            register={register}
                            unit={false}
                        />
                    </div>
                    <div className='buttons'>
                        <Dialog.Close asChild>
                            <button className='button-cancel'>Cancelar</button>
                        </Dialog.Close>
                        <button className='button-submit' type='submit'>Registrar nova viagem</button>

                    </div>
                </form>

            </Dialog.Content>

        </Dialog.Portal>

    );
}

export default TripsRegisterPage;

