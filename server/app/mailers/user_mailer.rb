class UserMailer < ApplicationMailer
  def welcome_email(user)
    @user = user
    sg = SendGrid::API.new(api_key: ENV['SENDGRID_API_KEY'])
    data = {
      personalizations: [{
        to: [{ email: @user.email }],
        dynamic_template_data: { name: @user.name, email: @user.email } # Matches {{name}} in SendGrid template
      }],
      from: { email: ENV['SENDER_EMAIL'] },
      template_id: ENV['WELCOME_EMAIL_TEMPLATE_ID'] # Replace this with your actual template ID
    }

    response = sg.client.mail._('send').post(request_body: data.to_json)
    puts response.status_code
  end

  def team_invite(user, team)
    @team = team
    @user = user
    sg = SendGrid::API.new(api_key: ENV['SENDGRID_API_KEY'])
    data = {
      personalizations: [{
        to: [{ email: @user.email}],
        dynamic_template_data: { name: @user.name, team_name: @team.name } # Matches {{name}} in SendGrid template
      }],
      from: { email: ENV['SENDER_EMAIL'] },
      template_id: ENV['WELCOME_EMAIL_TEMPLATE_ID'] # Replace this with your actual template ID
    }

    response = sg.client.mail._('send').post(request_body: data.to_json)
    puts response.status_code
  end

  def added_to_team(user, team)
    @team = team
    @user = user
    sg = SendGrid::API.new(api_key: ENV['SENDGRID_API_KEY'])
    data = {
      personalizations: [{
        to: [{ email: @user.email }],
        dynamic_template_data: { name: @user.name, team_name: @team.name } # Matches {{name}} in SendGrid template
      }],
      from: { email: ENV['SENDER_EMAIL'] },
      template_id: ENV['ADDED_TO_TEAM_EMAIL_TEMPLATE_ID'] # Replace this with your actual template ID
    }

    response = sg.client.mail._('send').post(request_body: data.to_json)
    puts response.status_code
  end

  def password_reset(user)
    @user = user
    @reset_url = "#{ENV['BASE_URL']}/reset-password?token=#{user.reset_password_token}"
    sg = SendGrid::API.new(api_key: ENV['SENDGRID_API_KEY'])
    data = {
      personalizations: [{
        to: [{ email: @user.email }],
        dynamic_template_data: { name: @user.name, reset_url: @reset_url } # Matches {{name}} in SendGrid template
      }],
      from: { email: ENV['SENDER_EMAIL'] },
      template_id: ENV['PASSWORD_RESET_EMAIL_TEMPLATE_ID'] # Replace this with your actual template ID
    }

    response = sg.client.mail._('send').post(request_body: data.to_json)
    puts response.status_code
  end
end
