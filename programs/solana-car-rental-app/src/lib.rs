use anchor_lang::{prelude::*, solana_program::entrypoint::ProgramResult};

declare_id!("D2nvJ9h3Rtx5E5HY3ioeGdaWd5syJuekRy4uMHWWQNZL");

#[account]
pub struct User {
    pub user_id: u8,
    pub name: String,
    pub wallet_address: Pubkey
}

#[account] 
pub struct Car {
    pub car_id: u8,
    pub model: String,
    pub location: String,
    pub monthly_price: u8,
    pub availability_status: bool,
    pub owner_wallet_address: Pubkey
}

#[account]
pub struct Booking {
    pub booking_id: u8,
    pub user_id: u8,
    pub car_id: u8,
    pub start_time: u8,
    pub end_time: u8,
}

#[account]
pub struct Payment {
    pub payment_id: u8,
    pub user_id: u8,
    pub amount: u8,
}

#[account]
pub struct CarRentalApp{
    pub users: Vec<u8>,
    pub cars: Vec<u8>,
    pub bookings: Vec<u8>,
    pub payments: Vec<u8>,
}

#[derive(Accounts)]
pub struct CreateCarRentalApp<'info>{
    #[account(init,payer=signer,space= 8 + 32 + 1000, seeds = ["initialize".as_bytes().as_ref(), signer.key().as_ref()], bump)]
    pub car_rental_app: Account<'info, CarRentalApp>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info,System>
}
#[derive(Accounts)]
#[instruction(input: u8)]
pub struct AddCar<'info>{
    #[account(
    init,
    payer=signer,
    space= 8 + 32 + 1000, 
    seeds = [input.to_string().as_bytes().as_ref(), signer.key().as_ref()],
    bump)]
    pub car: Account<'info, Car>,
    #[account(mut)]
    pub car_rental_app: Account<'info, CarRentalApp>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info,System>
}

#[derive(Accounts)]
#[instruction(input: u8)]
pub struct AddUser<'info>{
    #[account(init,payer=signer,space= 8 + 32 + 1000+5 , seeds = [input.to_string().as_bytes().as_ref(), signer.key().as_ref()], bump)]
    pub user: Account<'info, User>,
    #[account(mut)]
    pub car_rental_app: Account<'info, CarRentalApp>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info,System>
}


#[derive(Accounts)]
#[instruction(booking_id: u8, payment_id: u8)]
pub struct BookCar<'info>{
    #[account(init,payer=signer,space= 8 + 8 + 1000, seeds = [booking_id.to_string().as_bytes().as_ref(), signer.key().as_ref()], bump)]
    pub booking: Account<'info, Booking>,
    #[account(init,payer=signer,space= 8 + 8 + 1000, seeds = [payment_id.to_string().as_bytes().as_ref(), signer.key().as_ref()], bump)]
    pub payment: Account<'info, Payment>,
    #[account(mut)]
    pub car: Account<'info, Car>,
    pub user: Account<'info, User>,
    #[account(mut)]
    pub car_rental_app: Account<'info, CarRentalApp>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info,System>
}

#[program]
pub mod solana_car_rental_app {
    use anchor_lang::accounts::signer;

    use super::*;
    pub fn create_car_rental_app(ctx: Context<CreateCarRentalApp>) -> Result<()> {
        let car_rental_app = &mut ctx.accounts.car_rental_app;
        car_rental_app.users = vec![];
        car_rental_app.cars = vec![];
        car_rental_app.bookings = vec![];
        car_rental_app.payments = vec![];

        Ok(())
    }
    pub fn add_car(ctx: Context<AddCar>, car_id: u8, model: String, location: String, monthly_price: u8, availability_status: bool) -> Result<()> {
        let car_rental_app = &mut ctx.accounts.car_rental_app;
        let car = &mut ctx.accounts.car;
        
        car.car_id = car_id;
        car.model = model;
        car.location = location;
        car.availability_status = availability_status;
        car.monthly_price = monthly_price;
        car.owner_wallet_address = *ctx.accounts.signer.key;

        car_rental_app.cars.push(car.car_id);

        Ok(())
    }

    pub fn add_user(ctx: Context<AddUser>, input: u8) -> Result<()> {
        let car_rental_app = &mut ctx.accounts.car_rental_app;
        let user = &mut ctx.accounts.user;
        user.user_id = input;
        user.name = "TestUser".to_string();
        user.wallet_address = *ctx.accounts.signer.key;

        car_rental_app.users.push(user.user_id);

        Ok(())
    }

    pub fn book_car(ctx: Context<BookCar>, booking_id: u8, payment_id: u8) -> Result<()> {
        let car_rental_app = &mut ctx.accounts.car_rental_app;
        let car = &mut ctx.accounts.car;
        let booking = &mut ctx.accounts.booking;
        let user = &mut ctx.accounts.user;
        let payment = &mut ctx.accounts.payment;

        payment.payment_id = payment_id;
        payment.amount = car.monthly_price;
        payment.user_id = user.user_id;
        
        booking.booking_id = booking_id;
        booking.car_id = car.car_id;
        booking.user_id = user.user_id;


        car_rental_app.bookings.push(booking.booking_id);
        car_rental_app.payments.push(payment.payment_id);



        Ok(())
    }

}


