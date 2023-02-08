# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)


currencies = FiatCurrency.create([{ name: 'Brazilian Real', code: 'BRL', symbol: 'R$', country_code: 'BR' },
                                  { name: 'Australian Dollar', code: 'AUD', symbol: 'A$', country_code: 'AU' },
                                  { name: 'Indian Ruppee', code: 'INR', symbol: '₹', country_code: 'IN' }])

Bank.create([{ name: "PIX", fiat_currency: currencies[0] },
             { name: "PayID", fiat_currency: currencies[1] },
             { name: "UPI", fiat_currency: currencies[2] }])

Token.create([{ chain_id: 80001, address: "0x0000000000000000000000000000000000000000",
                decimals: 18, name: 'Matic MUMBAI', symbol: 'MATIC', coingecko_id: 'matic-network' },
              { chain_id: 80001, address: "0x04B2A6E51272c82932ecaB31A5Ab5aC32AE168C3",
                decimals: 18, name: 'GFARMDAI', symbol: 'GFARMDAI', coingecko_id: 'dai' }])