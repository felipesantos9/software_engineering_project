import './tripsInputStyle.css';

interface TrisInputProps {
    placeholderText: string;
    labelTitle: string;
    typeInput: 'number' | 'date'; // 'text' -> Texto Normal , 'password' -> Senhas (vai ficar aquele bagulhinho escondido :) ) , 'email' -> Vai verificar o @
    inputId: "weight_value" | "distance_value" | 'trip_date';
    register: any;
    unit: boolean;
}


function TrisInput({
    placeholderText,
    labelTitle,
    typeInput,
    inputId,
    register,
    unit
}: TrisInputProps) {
    const UnitSelect = (options: (WeightUnit | DistanceUnit)[], values: string[], name: 'weight_unit' | 'distance_unit') => {
        return (
            <div className='input-group-select'>
                <label className="label-style">Unidade utilizada</label> <br />
                <select className="unit-select-style"  {...register(name)}>
                    {options.map((option, index) => (
                        <option key={index} value={option}>
                            {values[index]}
                        </option>
                    ))}
                </select>
            </div>
        );
    }

    const switchUnit = () => {
        switch (inputId) {
            case "weight_value":
                return UnitSelect(['g', 'lb', 'kg', 'mt'], ['gramas', 'libras', 'kilos', 'toneladas'], 'weight_unit')
            case "distance_value":
                return UnitSelect(['mi', 'km'], ['milhas', 'kilometros'], 'distance_unit');
        }
    }

    return (
        <div className="input-group">
            <div>
                <label className="label-style">{labelTitle}</label> <br />
                <input
                    id={inputId}
                    type={typeInput}
                    placeholder={placeholderText}
                    className="input-style"
                    required
                    {...register(inputId.toString())}
                />
            </div>
            {unit && switchUnit()}
        </div>
    );
}

export default TrisInput;
