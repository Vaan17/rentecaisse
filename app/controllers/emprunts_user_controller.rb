class EmpruntsUserController < ApplicationController
    
    def say_goodbye
        message = "au revoir :)"
        render json: message
    end
    
    def get_emprunts_users
        listeEmprunts = Emprunt.all
        

        render json: listeEmprunts
    end

    def get_emprunts_user_by_id
        emprunt = Emprunt.find(params[:id])

        render json: emprunt
    end

    
end