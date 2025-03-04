class UserMailer < ApplicationMailer
  def welcome_email(user)
    @user = user
    sg = SendGrid::API.new(api_key: ENV['SENDGRID_API_KEY'])
    data = {
      personalizations: [{
        to: [{ email: @user.email }],
        dynamic_template_data: { name: @user.name, email: @user.email } # Matches {{name}} in SendGrid template
      }],
      from: { email: 'devom393@gmail.com' },
      template_id: 'd-58e96bae274e4d73971cb8ea4823387d' # Replace this with your actual template ID
    }

    response = sg.client.mail._('send').post(request_body: data.to_json)
    puts response.status_code
  end
end
