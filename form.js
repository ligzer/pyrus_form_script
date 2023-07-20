/**
 * Форма на оплату счёта
 */

// Заполняем сумму налога
form.onChange(['Сумма', 'Ставка НДС']).setValues(['Сумма НДС'], 
    state => {
        const [sum, tax] = state.changes;
        const taxes = {
            'Без НДС': 0.0,
            '20%': 0.2,
            '10%': 0.1,
            '0%': 0.0,
            }

        if(!tax.choice_id || !sum.value)
            return null
        const newValueForCalculatedField = taxes[tax.choice_name] *  sum.value;

        return [newValueForCalculatedField];
    });


let catalogINN = null;

form.getCatalog('Банковские счета контрагентов').then(items => {
  catalogINN = items;
});


// Фильтруем поле банковские счета
form.onChange(['ИНН (Контрагент)'], true).setFilter("Расчетный счет(авто)", state => {
    let inn = null;
    if (state.changes.length > 0)
        inn = state.changes[0].value
    else
        inn = state.prev[0].value;
    const filtered = catalogINN.filter(item => item.columns['ИНН'] === inn).map(item => item.columns['Расчетный счет']);
    return { values: filtered }

});



//Скрываем ненужные поля
form.onChange(['ИНН (Контрагент)'], true).setVisibility(['Наименование банка', 'Расчетный счет'], state => {
        let inn = null;
        if (state.changes.length > 0)
            inn = state.changes[0].value
        else
            inn = state.prev[0].value;
        const filtered = catalogINN.filter(item => item.columns['ИНН'] === inn).map(item => item.columns['Расчетный счет']);
        return filtered.length == 0;
    })



form.onChange(['ИНН (Контрагент)'], true).setVisibility(['Расчетный счет(авто)'], state => {

        let inn = null;
        if (state.changes.length > 0)
            inn = state.changes[0].value
        else
            inn = state.prev[0].value;
        const filtered = catalogINN.filter(item => item.columns['ИНН'] === inn).map(item => item.columns['Расчетный счет']);
        return filtered.length > 0;
    })


// Одно обязательное поле из двух
form.onChange(['Расчетный счет(авто)', 'Расчетный счет'], true)
    .validate('Расчетный счет', state => {
        const [a, b] = state.changes;
        const aIsEmpty = !a || !a.item_id;
        const bIsEmpty = !b || !b.text;

        if (aIsEmpty && bIsEmpty)
            return {
                errorMessage: 'Необходимо указать Рассчётный счёт'
            };

        return null;
    });



form.onChange(['Расчетный счет(авто)', 'Расчетный счет'], true)
    .validate('Расчетный счет(авто)', state => {
        const [a, b] = state.changes;
        const aIsEmpty = !a || !a.item_id;
        const bIsEmpty = !b || !b.text;

        if (aIsEmpty && bIsEmpty)
            return {
                errorMessage: 'Необходимо выбрать Рассчётный счёт'
            };
            
        return null;
    });


