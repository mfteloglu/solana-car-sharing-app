import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaCarRentalApp } from "../target/types/solana_car_rental_app";


describe("solana-car-rental-app", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SolanaCarRentalApp as Program<SolanaCarRentalApp>;
  const address = "3PJ6N1aM7NPgq3HYYxhMWwk7dqMYFmJRnyxGhWFEYVbd"
  const personThatPays = program.provider.publicKey

  const [APP_PDA] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("initialize"), program.provider.publicKey.toBuffer()],
    program.programId
  );

  console.log("The wallet address :", personThatPays.toString());
  console.log("The PDA :", APP_PDA.toString());

  it("Initialize the car rental app!", async () => {
  
    const tx2 = await program.methods.createCarRentalApp().accounts({
      carRentalApp: APP_PDA}).rpc();
    console.log("Your transaction signature", tx2);

    var data = await program.account.carRentalApp.fetch(APP_PDA)
    console.log('Cars in the app: ', data.cars.toString());
  });

  
  it("add user 1", async() => {

    var userID = 111
    const [USER_PDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from(userID.toString()), program.provider.publicKey.toBuffer()],
      program.programId
    );

    try{
      const tx3 = await program.methods.addUser(userID).accounts({
        user: USER_PDA,
        carRentalApp: APP_PDA,
      }).rpc();
  
      console.log("Your transaction signature", tx3);
     } catch (error) {
      console.error("Error adding car:", error);
     }


    var data = await program.account.carRentalApp.fetch(APP_PDA)
    console.log('Users in the app: ', data.users.length);
    console.log('User ids : ', data.users[0]);
  });

  it("add user 2", async() => {

    var userID = 222
    const [USER_PDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from(userID.toString()), program.provider.publicKey.toBuffer()],
      program.programId
    );

    try{
      const tx3 = await program.methods.addUser(userID).accounts({
        user: USER_PDA,
        carRentalApp: APP_PDA,
      }).rpc();
  
      console.log("Your transaction signature", tx3);
     } catch (error) {
      console.error("Error adding car:", error);
     }

    var data = await program.account.carRentalApp.fetch(APP_PDA)
    console.log('Users in the app: ', data.users.length);
    console.log('User ids : ', data.users[0], data.users[1]);
  });
  it("add car 1", async() => {
      var carId = 123;
      var model = 'Mercedes-Benz E250';
      var location = 'Garching';
      var monthly_price = 100;
      var availability_status = true;
      

      
      const [CAR_PDA] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from(carId.toString()), program.provider.publicKey.toBuffer()],
        program.programId
      );
  
      const tx3 = await program.methods.addCar(carId, model, location, monthly_price, availability_status).accounts({
        car: CAR_PDA,
        carRentalApp: APP_PDA,
      }).rpc();
  
      console.log("Your transaction signature", tx3);
  
      var app = await program.account.carRentalApp.fetch(APP_PDA)
  
      console.log('New car registered !');
      console.log('Number of cars in the app: ', app.cars.length);
    });
  


  it("add car 2", async() => {
    var carId = 231;
    var model = 'Audi A3';
    var location = 'Marienplatz';
    var monthly_price = 200;
    var availability_status = true;
    const [CAR_PDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from(carId.toString()), program.provider.publicKey.toBuffer()],
      program.programId
    );

    try{
      const tx3 = await program.methods.addCar(carId, model, location, monthly_price,availability_status).accounts({
        car: CAR_PDA,
        carRentalApp: APP_PDA,
      }).rpc();
  
      console.log("Your transaction signature", tx3);
     } catch (error) {
      console.error("Error adding car:", error);
     }


    var data = await program.account.carRentalApp.fetch(APP_PDA)
    console.log('Cars in the app: ', data.cars.length);
    console.log('Car id location: ', data.cars.indexOf(123));
    console.log('Car ids : ', data.cars[0], data.cars[1]);
  });



  
  it("book car", async() => {

    var carID = 123
    var userID = 222
    var bookingID = 13
    var paymentID = 101
    const [CAR_PDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from(carID.toString()), program.provider.publicKey.toBuffer()],
      program.programId
    );
    const [USER_PDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from(userID.toString()), program.provider.publicKey.toBuffer()],
      program.programId
    );
    const [BOOKING_PDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from(bookingID.toString()), program.provider.publicKey.toBuffer()],
      program.programId
    );
    const [PAYMENT_PDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from(paymentID.toString()), program.provider.publicKey.toBuffer()],
      program.programId
    );
    try{
      const tx3 = await program.methods.bookCar(bookingID, paymentID).accounts({
        car : CAR_PDA,
        carRentalApp: APP_PDA,
        booking:BOOKING_PDA,
        user: USER_PDA,
        payment: PAYMENT_PDA

      }).rpc();
  
      console.log("Your transaction signature", tx3);
      console.log("BOOKING PDA", BOOKING_PDA);

     } catch (error) {
      console.error("Error adding car:", error);
     }


    var data = await program.account.carRentalApp.fetch(APP_PDA)
    console.log('Cars in the app: ', data.cars.length);
    console.log('Car id location: ', data.cars.indexOf(123));
    console.log('Car ids : ', data.cars[0], data.cars[1]);
    console.log('Bookings in the app: ', data.bookings.length);
    console.log('Booking ids : ', data.bookings[0]);
    console.log('Payments in the app: ', data.payments.length);
    console.log('Payment ids : ', data.payments[0]);

  });

});
