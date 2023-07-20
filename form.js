/**
 * Below is a simple script template.
 * Instead of `watchingFieldName` and `calculatedFieldName` use the real field names of this form.
 */
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

form.onChange(['ИНН (Контрагент)']).setValues(['Расчетный счет(авто)', 'БИК(авто)'],
    state => {
        const inn = state.changes[0].value;
        const filtered = catalogINN.filter(item => item.columns['ИНН'] === inn).map(item => [item.columns['Расчетный счет'],item.columns['БИК']]);;
        console.warn(filtered)
        return filtered.length > 0
            ? filtered[0]
            : ['', '']
    });




form.onChange(['ИНН (Контрагент)']).setFilter("Банковские счета контрагентов", state => {
  const [changes] = state.changes;
  if (!catalogINN || !changes || !changes.value)
    return null;
  const inn = changes.value;
//   const regionCol = state.changes[0].columns["State"];

  const filtered = catalogINN.filter(item => item.columns['ИНН'] === inn).map(item => item.columns['Расчетный счет']);;
//   const filtered = catalogItems
//     .filter(item => item.columns["State"] === regionCol)
//     .map(item => item.columns["City"]);

  return { values: filtered }
//   return filtered.length > 0
//     ? {
//         values: filtered
//       }
//     : null
});


Прячем автоматические поля, если они не заполнены
form.onChange(['Расчетный счет(авто)'], true).setVisibility(['Расчетный счет(авто)'], state => {
        if (state.changes.length > 0)
            return state.changes[0].value.length > 0
        else
            return state.prev[0].value.length > 0;
    })

form.onChange(['Расчетный счет(авто)'], true).setVisibility(['Расчетный счет'], state => {
        if (state.changes.length > 0)
            return state.changes[0].value.length == 0
        else
            return state.prev[0].value.length == 0;
    })

form.onChange(['БИК(авто)'], true).setVisibility(['БИК(авто)'], state => {
        if (state.changes.length > 0)
            return state.changes[0].value.length > 0
        else
            return state.prev[0].value.length > 0;
    })

form.onChange(['БИК(авто)'], true).setVisibility(['Наименование банка'], state => {
        if (state.changes.length > 0)
            return state.changes[0].value.length == 0
        else
            return state.prev[0].value.length == 0;
    })



// Одно обязательное поле из двух
form.onChange(['Банковские счета контрагентов', 'Расчетный счет'], true)
    .validate('Расчетный счет', state => {
      const [a, b] = state.changes;

      const aIsEmpty = !a || !a.text;
      const bIsEmpty = !b || !b.text;

      if (aIsEmpty && bIsEmpty)
        return {
          errorMessage: 'Необходимо указать Рассчётный счёт'
        };

        return null;
    });


