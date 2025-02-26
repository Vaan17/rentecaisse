class AddResetPasswordSentAtToUtilisateurs < ActiveRecord::Migration[7.2]
  def change
    add_column :utilisateurs, :reset_password_sent_at, :datetime
  end
end
