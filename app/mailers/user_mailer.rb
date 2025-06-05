require 'net/http'
require 'uri'
require 'json'
require 'dotenv'
Dotenv.load

class UserMailer < ApplicationMailer
  def send_mail(email:, subject:, htmlContent:)
    # define constants
    uri = URI.parse('https://api.brevo.com/v3/smtp/email')
    request = Net::HTTP::Post.new(uri)
    request['accept'] = 'application/json'
    request['api-key'] = ENV['API_KEY_BREVO']
    request['content-type'] = 'application/json'

    # construct email
    request.body = {
      sender: { name: ENV['SENDER_NAME'], email: ENV['EMAIL_SENDER'] },
      to: [ { email: email } ],
      subject: subject,
      htmlContent: htmlContent
    }.to_json

    # send email
    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(request)
    end

    # print response into the console
    puts response.body
  end
end
