# Contact Form communicating with Google calendar

Home test for **LL Transportation Marketing Solutions d.o.o.**  
![demo](https://github.com/Aleksej10/calendar/blob/master/demo.gif)  
This app lets you quickly schedule an event on your google account.  
  
You can check it out [here](https://aleksej10.github.io/calendar).

## Usage

- Log in with your google account.
- Fill in the form
- Solve reCAPTCHA
- New event will be created in the account you logged in with
- Name of the event will be taken from `name` field
- Other info, such as `phone` and `email` will be added to the event description
- `email` given will be added to event's attendees
- You will receive two email reminders, 15 and 30 minutes prior to the event

## Dev stuff

At the beginning, **google api** is used to log user in.  
On loggin, submit form is shown.  
Each field must be valid (also filled), otherwise slicking on `submit` button will show error message and focus you on first invalid field.  
Spam detection is realised using **google reCAPTCHA v2**.  
Next, new event is created then added to logged in account using **google calendar api**.  
After that, email is sent to given the `email` using **smtp.js** library and **elastic email** as domain.

## Notes

Everything is realised on client side using plain `html` + `css` + `javascipt` so the app can be fully operational when hosted on **Github Pages**.  
Page is **mobile friendly**, and verified by google.

### Email sending

**Elastic email** and/or **smtp.js** have internal server error as of recently, so the confirmation email ends up not being sent.






