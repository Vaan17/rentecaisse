require 'rufus-scheduler'


if defined?(Rails::Server) && !Rails.env.test?
  scheduler = Rufus::Scheduler.singleton


  scheduler.cron '0 0 * * *' do
    Rails.logger.info "Tâche quotidienne exécutée à #{Time.now}"
  end

  # Tâche d'anonymisation des comptes utilisateurs - exécutée tous les jours à 02:00
  scheduler.cron '0 2 * * *' do
    Rails.logger.info "Début de la tâche d'anonymisation des comptes à #{Time.now}"
    
    begin
      require Rails.root.join('app/scheduler/DeletionAccountSchedule')
      

      count = DeletionAccountSchedule.process_pending_anonymizations
      
      Rails.logger.info "Fin de la tâche d'anonymisation à #{Time.now}: #{count} compte(s) anonymisé(s)"
    rescue => e
      Rails.logger.error "Erreur lors de l'exécution de la tâche d'anonymisation: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
    end
  end


  scheduler.every '1h' do
    Rails.logger.info "Tâche horaire exécutée à #{Time.now}"
  end


  scheduler.every '30m' do
    Rails.logger.info "Tâche exécutée toutes les 30 minutes à #{Time.now}"
  end

  # Pour plus d'informations sur la syntaxe de programmation:
  # https://github.com/jmettraux/rufus-scheduler#scheduling

  Rails.logger.info "Rufus-Scheduler démarré avec succès"
end 