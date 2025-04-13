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

  def team_invite(user, team)
    @team = team
    @user = user
    sg = SendGrid::API.new(api_key: ENV['SENDGRID_API_KEY'])
    data = {
      personalizations: [{
        to: [{ email: @user.email}],
        dynamic_template_data: { name: @user.name, team_name: @team.name } # Matches {{name}} in SendGrid template
      }],
      from: { email: 'devom393@gmail.com' },
      template_id: 'd-58e96bae274e4d73971cb8ea4823387d' # Replace this with your actual template ID
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
      from: { email: 'devom393@gmail.com' },
      template_id: 'd-fdc7f3286afc414b855a882f4e7888f5' # Replace this with your actual template ID
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
      from: { email: 'devom393@gmail.com' },
      template_id: 'd-c650bb2cae4643cf91b5006a459b1b28' # Replace this with your actual template ID
    }

    response = sg.client.mail._('send').post(request_body: data.to_json)
    puts response.status_code
  end
end
