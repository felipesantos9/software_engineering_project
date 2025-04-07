import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './tripsRegisterModalStyle.css';
import TrisInput from '../inputTrips/tripsInput';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { tripRegisterRequest } from '../../services/api/tripsRequest';
import { Dialog } from "radix-ui";
import { RxCross1 } from "react-icons/rx";
import useUser from '../../hooks/useUser';

function TripsRegisterPage() {
    const navigate = useNavigate();
    const [buttonIsDisabled, setButtonIsDisabled] = useState(false);
    const { user } = useUser();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TripInterface>({
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
        setButtonIsDisabled(true);
        try {
            const response = await tripRegisterRequest(content, user.token!);

            if (response) {
                toast.success("Registro realizado com sucesso!", { duration: 2000 });
                setTimeout(() => {
                    setButtonIsDisabled(false);
                    navigate('/trips');
                    toast.success("Registro realizado com sucesso!", { duration: 2000 });
                    reset();
                }, 2000);
                return;
            }

            toast.error("Falha ao criar o registro. Tente novamente!", { duration: 2000 });
        } catch (error) {
            toast.error("Erro inesperado. Tente novamente!", { duration: 2000 });
        } finally {
            setButtonIsDisabled(false);
        }
    };

    return (
        <Dialog.Portal>
            <Dialog.Overlay className="DialogOverlay" />
            <Dialog.Content className="DialogContent">
                <Dialog.Title></Dialog.Title>
                <Toaster />
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
                            <select
                                className="method-select-style"
                                {...register('transport_method')}
                            >
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
                            <button className='button-cancel' disabled={buttonIsDisabled}>Cancelar</button>
                        </Dialog.Close>
                        <button className='button-submit' type='submit' disabled={buttonIsDisabled}>
                            Registrar nova viagem
                        </button>

                    </div>
                </form>
            </Dialog.Content>
        </Dialog.Portal>
    );
}

export default TripsRegisterPage;

