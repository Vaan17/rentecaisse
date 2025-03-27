class SitesController < ApplicationController
  def fetch_all
    sites = Site.all

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