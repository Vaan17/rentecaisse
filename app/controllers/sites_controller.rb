class SitesController < ApplicationController
  before_action :verify_authentication

  def fetch_all
    sites = Site.all.where(entreprise_id: @current_user.entreprise_id)
    sites = sites.map(&:to_format)

    render json: sites
  end

  def fetch
    site_id = params[:id]
    site = Entreprise.find(site_id)

    render json: site
  end

  def create
    params["data"].permit!

    attributes = params["data"].to_h
    attributes["entreprise_id"] = @current_user["entreprise_id"]

    newSite = Site.create(attributes)

    render json: newSite.to_format
  end

  def update
    params["data"].permit!

    attributes = params["data"].to_h

    Site.find(attributes["id"]).update(attributes)
    updatedSite = Site.find(attributes["id"])

    render json: updatedSite.to_format
  end

  def delete
    Site.find(params["id"]).delete

    render json: { "id" => params["id"] }
  end
end
