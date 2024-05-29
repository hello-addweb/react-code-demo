import { IFinancialSettings } from '../interfaces';

export class FinancialSettingsRepository implements IFinancialSettings<[]> {
    public async findByCurrency(currency: string, db: any) {
        try {
            // console.log('currency', currency);
            const result = await db.collection('FinancialSettings').findOne({
                $and: [
                    {
                        deleted_at: { $exists: false }
                    },
                    {
                        currency_name: currency
                    }
                ]
            });
            return result;
        } catch (error) {
            console.log(error);
        }
    }
}