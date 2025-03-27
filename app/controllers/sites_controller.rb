class SitesController < ApplicationController
  def fetch_all
    sites = Site.all

    render json: sites
  end

  def create
  end

  def update
  end

  def delete
  end
end