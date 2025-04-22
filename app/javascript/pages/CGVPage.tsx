import React from 'react';
import styled from 'styled-components';
import BackgroundLayout from '../components/layout/BackgroundLayout';
import { Button, Card, CardActions, CardContent } from '@mui/material';
import { Flex } from '../components/style/flex';
import { useNavigate } from 'react-router-dom';

const Logo = styled.img`
  width: 48px;
  height: 48px;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`
const BrandName = styled.span`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  letter-spacing: -0.02em;
  font-family: 'Inter', sans-serif;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`
const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #333;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  letter-spacing: -0.01em;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
`
const SCard = styled(Card)`
  width: 50%;
  min-width: 300px;
  height: 90%;
  padding: 1em;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
`
const SCardContent = styled(CardContent)`
  padding: 0 1em !important;
  height: 90%;
  overflow-y: auto;
`
const SCardActions = styled(CardActions)`
  padding: 0 1em !important;
  height: 10%;
  justify-content: end;
  align-items: end !important;
`

const cgv = [
  {
    title: "Introduction",
    paraphs: [
      "Les CGV (conditions générales de vente) suivantes régissent les relations contractuelles entre Rentecaisse, établi au 3 Rue Michael Faradey, 44800 Saint-Herblain, immatriculé SIRET : *** *** *** ***** - NAF : ****X et ses clients lors de la délivrance d’accès privé au service procuré par Rentecaisse.",
      "Rentecaisse est déclaré comme société de développement web sous le numéro d'activité de formation : ** ** *** ** **."
    ]
  },
  {
    title: "Description du service",
    paraphs: [
      "L’abonnement au service n'est considéré comme définitif qu'à réception du dossier complet accompagné d'un chèque du montant actuel de l’application web/mobile de location de véhicule.",
      "L’abonnement est confirmé nominativement aux clients avant tout premier accès au service, précisant les identifiants de connexion et un lien d’accès à l’application en ligne. Une documentation utilisateur est disponible sur demande lors de la réception des précédentes informations, ou bien à n’importe quel moment auprès du service support.",
      "Rentecaisse est enregistré comme société de développement web et les droits d’abonnement sont éligibles à toute entreprise disposant d’au moins un véhicule de fonction. L’abonnement prendra fin dès la demande effectuée auprès du service support, l’accès au service prendra fin à la date de renouvellement prévu de celui-ci."
    ]
  },
  {
    title: "Accès à l'application",
    paraphs: [
      "Le présent service sera accessible depuis n’importe quel navigateur web (Chrome, Firefox, Internet Explorer, Microsoft Edge, etc…) à l’adresse web fournie en même temps que l’envoi des identifiants de connexion.",
      "L’identification sur la plateforme se déroule par le biais d’une adresse électronique et d’un mot de passe précédemment renseigné lors de la phase d’inscription.",
      "La confidentialité et usage des identifiants de connexion répond de la responsabilité de son propriétaire et ne seront jamais réutilisé par Rentecaisse.",
      "La confidentialité et gestion des informations personnel concernant le compte d’un utilisateur répond de la responsabilité de son propriétaire et de l’organisme auquel il est rattaché."
    ]
  },
  {
    title: "Tarifs et modalités de paiement",
    paraphs: [
      "Comming soon..."
    ]
  },
  {
    title: "Obligations et responsabilités du client",
    paraphs: [
      "Le client s’engage d'utiliser le présent service conformément à la loi, à respecter les droits des tiers et de ne divulguer aucune information concernant un quelconque utilisateur du service, ou de son organisation de rattachement.",
      "Toute utilisation d’un véhicule à la suite de sa réservation à l’obligation d’être conforme à son utilité définie par l’organisme propriétaire, ou en avoir l’accord explicite de ce dernier.",
      "Tout incident ou dommage causé quel qu'il soit durant la période de location du véhicule, que ce soit sur un bien matériel, public ou privé, ou sur une personne physique, sera de la responsabilité de la personne responsable du dit véhicule."
    ]
  },
  {
    title: "Durée du contrat et résiliation",
    paraphs: [
      "Comming soon..."
    ]
  },
  {
    title: "Protection des données personnelles",
    paraphs: [
      "Rentecaisse s’engage à respecter l’ensemble des réglementations en matière de protection des données personnelles, notamment le Règlement Général sur la Protection des Données (RGPD). Nous mettons tout en œuvre pour garantir la confidentialité, l’intégrité et la sécurité des données personnelles de nos utilisateurs.",
      "Nous collectons uniquement les données nécessaires à :",
      (<ul>
        <li>La création et la gestion des comptes utilisateurs.</li>
        <li>Le bon fonctionnement des services proposés sur notre plateforme.</li>
        <li>L’amélioration continue de nos fonctionnalités et services.</li>
      </ul>),
      "Les données personnelles sont conservées pendant une durée déterminée avant d’être supprimées ou anonymisées. Conformément au RGPD, vous disposez en tant qu’utilisateur des droits suivant concernant vos données personnelles :",
      "Droit d’accès - droit de rectification - droit d’opposition - droit à l’effacement - droit à la portabilité - droit à la limitation."
    ]
  },
  {
    title: "Force majeure",
    paraphs: [
      "Rentecaisse ne pourra être tenue responsable de tout manquement ou retard dans l’exécution de ses obligations contractuelles résultant d’un événement de force majeure tel que défini par l’article 1218 du Code civil.",
      "Un événement de force majeure s’entend comme un événement imprévisible, irrésistible et extérieur rendant impossible l’exécution des obligations contractuelles. À titre d’exemple, les situations suivantes peuvent constituer des cas de force majeure :",
      (<ul>
        <li>Catastrophes naturelles : tremblements de terre, inondations, tempêtes, éruptions volcaniques, ou autres phénomènes naturels exceptionnels.</li>
        <li>Conflits armés ou troubles sociaux : guerres, actes de terrorisme, émeutes, révolutions, grèves générales ou locales affectant les prestataires ou partenaires de l’entreprise.</li>
        <li>Interruption des services essentiels : pannes généralisées de réseaux électriques, coupures de l’accès à Internet, défaillances des infrastructures de télécommunications ou des fournisseurs de services d’hébergement.</li>
      </ul>)
    ]
  },
  {
    title: "Loi applicable et résolution des litiges",
    paraphs: [
      "Les présentes Conditions Générales de Vente sont régies par la loi française. Toute question relative à leur validité, leur interprétation ou leur exécution sera également soumise au droit français, sauf dispositions impératives contraires prévues par la législation du pays de résidence du consommateur.",
      "En cas de différend relatif à l’interprétation ou à l’exécution des présentes, les parties s’engagent à rechercher une solution amiable avant d’engager toute procédure judiciaire. À cette fin, l’utilisateur peut contacter Rentecaisse à l’adresse suivante : [adresse e-mail ou postale].",
      "Si aucune solution amiable n’est trouvée dans un délai raisonnable, l’utilisateur peut recourir gratuitement à un médiateur de la consommation conformément aux dispositions des articles L.611-1 et suivants du Code de la consommation. Les coordonnées du médiateur compétent seront communiquées sur demande."
    ]
  },
]

const CGVPage = () => {
  const navigate = useNavigate()

  return (
    <BackgroundLayout backgroundImage="/images/backgrounds/parking-background.png">
      <SCard>
        <SCardContent>
          <Flex justifyCenter gap="1em">
            <Logo src="/images/logos/logo.png" alt="RenteCaisse Logo" />
            <BrandName>RENTECAISSE</BrandName>
          </Flex>
          <Title>Conditions Générales de Vente (CGV)</Title>
          <div>
            {cgv.map((section) => (
              <div>
                <h2>{section.title}</h2>
                {section.paraphs.map((paraph) => (
                  typeof paraph === 'string' ? (
                    <p>{paraph}</p>
                  ) : (
                    paraph
                  )
                ))}
              </div>
            ))}
          </div>
        </SCardContent>
        <SCardActions>
          <Button onClick={() => navigate(-1)} variant="contained" color="primary">
            Retour
          </Button>
        </SCardActions>
      </SCard>
    </BackgroundLayout >
  )
}

export default CGVPage