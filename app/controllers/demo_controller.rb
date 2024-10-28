class DemoController < ApplicationController
    def say_hi
        message = "Hi there :D"

        render json: message
    end

    def say_goodbye
        message = "au revoir :)"
        render json: message
    end
end