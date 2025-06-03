class SitesController < ApplicationController
  before_action :verify_authentication

  def fetch_all
    sites = Site.all.where(entreprise_id: @current_user.entreprise_id)

    render json: sites
  end

  def fetch
    site_id = params[:id]
    site = Entreprise.find(site_id)

    render json: site
  end

  def create
  end

  def update
  end

  def delete
  end
end