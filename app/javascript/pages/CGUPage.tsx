import React from 'react';
import styled from 'styled-components';
import BackgroundLayout from '../components/layout/BackgroundLayout';
import { useNavigate } from 'react-router-dom';
import { Flex } from '../components/style/flex';
import { Button, Card, CardActions, CardContent } from '@mui/material';

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

const cgu = [
  {
    title: "Introduction",
    paraphs: [
      "Rentecaisse met à disposition de ses utilisateurs des accès à son application en ligne de location de véhicule afin qu’il puisse être accessible et utilisé depuis n’importe quel support numérique et depuis n’importe quel navigateur web.",
      "L’acceptation des présentes CGU (Conditions Générales d’Utilisation) doivent être acceptée avant toute possibilité d’utilisation de nos services, la demande d’acceptation des CGU en question se présente à la phase d’inscription de l’utilisateur."
    ]
  },
  {
    title: "Objet de l'application",
    paraphs: [
      "L'application Rentecaisse est dédiée à la gestion de prêt de véhicules pour les employés des entreprises clientes. Elle permet aux utilisateurs autorisés de réserver, gérer et restituer des véhicules et leurs clés associés en toute simplicité, tout en assurant une traçabilité complète des emprunts liées à l’application.",
      "Fonctionnalités principales :",
      (<ul>
        <li>Réservation de véhicules : Les utilisateurs peuvent consulter les véhicules disponibles aux emprunts, choisir celui qui correspond à leurs besoins et effectuer une réservation en ligne via l’application.</li>
        <li>Gestion des emprunts : Les utilisateurs peuvent suivre leurs emprunts, gérer les horaires de prise en charge et de restitution des véhicules, et effectuer des modifications en cas de besoin, notamment au niveau des horaires, voitures utilisées.</li>
        <li>Suivi des véhicules : L’application permet de connaître les informations des véhicules, y compris leurs statuts (disponible, réservé, en cours d’utilisation, etc.).</li>
        <li>Panel administrateur : Un espace réservé aux administrateurs permet la gestion du périmètre de l’entreprise au niveau des données de l’application.  Les administrateurs peuvent ajouter, modifier ou supprimer des informations concernant les sites des emprunts, les véhicules disponibles, les clés associées, les utilisateurs inscrits, les emprunts en cours, ainsi que la localisation des véhicules. Cette fonctionnalité garantit une gestion optimale et centralisée des ressources de l’application, permettant aux administrateurs d'ajuster rapidement les informations en fonction des besoins de l'entreprise.</li>
        <li>Validation des affectations utilisateurs : Les administrateurs ont la possibilité de valider les affectations des utilisateurs à leurs entreprises respectives lors de leur inscription. Lorsqu'un nouvel utilisateur s'inscrit, il doit indiquer l'entreprise à laquelle il appartient et entrer le code fourni par son entreprise. L'administrateur devra valider cette affectation avant que l'utilisateur ne puisse accéder aux fonctionnalités de l'application, c’est à dire toutes les fonctionnalités à partir du menu principal, telles que la réservation de véhicules ou l'accès aux informations liées à son entreprise. Cela permet de garantir que seuls les utilisateurs autorisés aient accès aux services et ressources de l'application.</li>
      </ul>),
      "Cette plateforme en ligne vise à offrir une solution simple, rapide et sécurisée pour la gestion des emprunts de véhicules au sein des entreprises."
    ]
  },
  {
    title: "Création et gestion du compte utilisateur",
    paraphs: [
      "Les informations nécessaires à la création d’un compte rentecaisse nécessite de renseigner, de la part de l’utilisateur en question, au minimum les informations suivantes de type : Nom, Prénom, adresse électronique, mot de passe, attestation sur l’honneur de la détention du permis de conduire, ainsi que d’autres informations personnelles et de résidence.",
      "La sécurité et la confidentialité des informations du compte de l’utilisateur (identifiants de connexion + informations personnelles) sont de la responsabilité de leur propriétaire, aucun d’entre eux ne doit être communiqué à autrui et pour quelconque raison.",
      "Une mise à jour partielle des informations d’un compte utilisateur peut avoir lieu et peut être réalisée par l’administrateur de l’organisation auquel l’utilisateur est rattaché sur l’application, ou bien, dans des cas exceptionnels, par le service d’administration de Rentecaisse."
    ]
  },
  {
    title: "Conditions d'utilisation",
    paraphs: [
      "Utilisation autorisée :",
      "L'application Rentecaisse est conçue pour être utilisée dans un cadre strictement professionnel par les employés des entreprises clientes. L'accès et l'utilisation des services proposés par l'application doivent être réalisés dans le respect des objectifs de gestion et des emprunts de véhicules pour les entreprises. Toute utilisation à des fins personnelles ou non professionnelles est interdite.",
      "Restrictions :",
      "L'utilisateur s'engage à ne pas tenter de contourner ou de désactiver les mécanismes de sécurité de l'application, y compris mais sans se limiter à, la manipulation des données, le piratage des comptes utilisateurs, l'accès non autorisé à des fonctionnalités réservées ou la modification du code source de l'application. Toute tentative de modification, altération ou manipulation non autorisée de l'application constitue une violation grave des présentes CGU et pourra entraîner des sanctions allant jusqu'à la suspension ou la suppression du compte utilisateur, ainsi que des poursuites légales.",
      "Utilisation des données par les entreprises clientes :",
      "En tant qu’administrateur de l'application, l'entreprise cliente est responsable de la gestion et de la conformité des actions de ses utilisateurs. L'entreprise doit veiller à ce que les utilisateurs respectent les règles et les conditions d’utilisation énoncées dans ces CGU, et doit prendre les mesures nécessaires pour s'assurer que toutes les actions menées via l'application sont conformes aux lois et réglementations applicables. L'entreprise est également responsable de la protection des données de ses employés et doit s'assurer que l’utilisation de l’application respecte les principes de confidentialité et de sécurité des données.",
      "En cas de non-respect des conditions d'utilisation par un utilisateur, l'entreprise cliente s'engage à prendre les mesures appropriées, y compris la suspension ou la suppression des accès de l'utilisateur fautif."
    ]
  },
  {
    title: "Sécurité de l'application",
    paraphs: [
      "Mesures de sécurité mises en place :",
      "L'application Rentecaisse met en œuvre des mesures de sécurité robustes afin de protéger les données personnelles et professionnelles des utilisateurs, ainsi que les informations relatives aux emprunts de véhicules. Ces mesures incluent, de sécuriser les échanges de données entre l'utilisateur et le serveur, sécuriser en multiples facteurs l’accès à l’application pour renforcer la sécurité de l’application. Nous effectuons également de la veille technologique afin de garantir la sécurité de nos systèmes vis-à-vis des vulnérabilités systèmes.",
      "Obligation des utilisateurs de signaler tout incident de sécurité :",
      "Les utilisateurs sont tenus de signaler immédiatement à l’équipe de support de Rentecaisse tout incident de sécurité ou toute activité suspecte pouvant compromettre la sécurité de l’application ou des données des utilisateurs. Cela inclut, mais ne se limite pas à, la découverte de failles de sécurité, l’utilisation non autorisée de comptes, ou toute autre situation pouvant affecter la confidentialité, l'intégrité ou la disponibilité des informations. L’utilisateur doit également informer immédiatement Rentecaisse en cas de perte ou de vol de ses identifiants d'accès (nom d'utilisateur, mot de passe, etc.).",
      "En cas de signalement d'un incident de sécurité, Rentecaisse prendra les mesures nécessaires pour enquêter et résoudre le problème dans les meilleurs délais, tout en assurant la confidentialité des informations concernées. Les utilisateurs sont également invités à adopter des comportements responsables pour préserver la sécurité de leurs données, comme choisir des mots de passe sécurisés et ne pas les partager avec d'autres personnes."
    ]
  },
  {
    title: "Propriété intellectuelle",
    paraphs: [
      "L’ensemble des éléments composant l’application web Rentecaisse, incluant mais sans s’y limiter, les logiciels, codes sources, graphismes, logos, textes, images, vidéos, bases de données et fonctionnalités, est la propriété exclusive de Rentecaisse. L’ensemble de ces éléments sont protégés par les lois en vigueur en matière de propriété intellectuelle, notamment le Code de la propriété intellectuelle.",
      "Toute reproduction, représentation, modification, distribution ou exploitation, totale ou partielle, de l’application ou de ses contenus, par quelque moyen que ce soit, sans l’autorisation préalable écrite de Rentecaisse, est strictement interdite et constitue une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.",
      "Toute utilisation non autorisée des éléments protégés par la propriété intellectuelle pourra entraîner la suspension ou la résiliation immédiate de l’accès à l’application, sans préjudice des éventuelles actions judiciaires que Rentecaisse pourrait engager pour faire valoir ses droits."
    ]
  },
  {
    title: "Modification des CGU",
    paraphs: [
      "Droit de modification :",
      "Rentecaisse se réserve le droit de modifier, d'actualiser ou de compléter les présentes Conditions Générales d'Utilisation (CGU) ainsi que les Conditions Générales de Vente (CGV) à tout moment, sans préavis. Ces modifications peuvent être effectuées afin de se conformer à la législation en vigueur, d’améliorer les services proposés ou d'adapter l’application aux besoins des utilisateurs.",
      "Changements mineurs :",
      "Pour les modifications mineures, qui n'affectent pas de manière significative l’utilisation des services ou les droits des utilisateurs, Rentecaisse enverra un e-mail pour informer les utilisateurs des mises à jour apportées. Dans ce cas, la simple poursuite de l'utilisation de l'application après notification des changements sera considérée comme une acceptation tacite des nouvelles conditions",
      `Exemple d'email : "Nous vous informons que nos Conditions Générales d'Utilisation ont été mises à jour. Ces changements n'affectent pas de manière significative votre utilisation de nos services. Vous pouvez consulter les nouvelles conditions [lien]. En continuant à utiliser notre application, vous acceptez ces modifications."`,
      "Changements majeurs :",
      "Pour toute modification substantielle ou impactant les droits des utilisateurs (par exemple, des changements dans la politique de confidentialité ou la gestion des données), Rentecaisse enverra également un e-mail pour informer les utilisateurs des changements importants. Dans ce cas, les utilisateurs devront accepter les nouvelles conditions simplement en continuant à utiliser l'application après réception de l'email. La poursuite de l'utilisation de l'application sera considérée comme une acceptation des nouvelles conditions.",
      `Exemple d'email : "Nous avons apporté des changements importants à nos Conditions Générales d'Utilisation. Pour continuer à utiliser notre service, nous vous demandons de bien vouloir prendre connaissance des nouvelles conditions. Vous pouvez consulter les mises à jour ici : [lien]. En continuant à utiliser notre application, vous acceptez ces nouvelles conditions."`,
      "Acceptation des mises à jour :",
      "Dans tous les cas, que les modifications soient mineures ou majeures, l'utilisateur est informé que la poursuite de l'utilisation de l'application après réception de l'email sera considérée comme une acceptation des nouvelles Conditions Générales d'Utilisation et des Conditions Générales de Vente. Si l'utilisateur ne souhaite pas accepter les nouvelles conditions, il devra cesser d'utiliser l'application à partir du moment où il reçoit le mail. Il pourra également demander la suppression de ses données conformément aux droits RGPD.",
      "En résumé, que les changements soient mineurs ou majeurs, la notification des modifications et l'acceptation de celles-ci par l'utilisateur se feront exclusivement par e-mail."
    ]
  },
  {
    title: "Droits des utilisateurs",
    paraphs: [
      "Vous disposez en tant qu’utilisateur des droits suivant concernant vos données personnelles : Droit d’accès - droit de rectification - droit d’opposition - droit à l’effacement - droit à la portabilité - droit à la limitation. Vous pouvez faire valoir ces droits à n’importe quel moment en contactant le service support à l’adresse électronique suivante : [email].",
      "Pour des questions de sécurité en lien avec le fonctionnement de notre service, et de garanties vis-à-vis de nos autres utilisateurs, toute demande de suppression ou anonymisation de données personnelles sera effectif après un délai de 30jours (ouvrés) à compter du jour de la réception de la demande."
    ]
  },
  {
    title: "Responsabilité de l'entreprise",
    paraphs: [
      "Rentecaisse met tout en œuvre pour assurer le bon fonctionnement de son application, mais ne saurait être tenue responsable des éventuels problèmes techniques, erreurs de réservation, ou autres incidents pouvant survenir lors de l’utilisation de ses services. En particulier, l'entreprise ne peut être tenue responsable des interruptions ou dysfonctionnements liés à des problèmes techniques, des pannes de serveurs, des erreurs de saisie de données par les utilisateurs, ou des erreurs de réservation. Rentecaisse décline également toute responsabilité en cas d’indisponibilité temporaire de l’application, notamment pour des travaux de maintenance, des mises à jour ou en raison d’événements indépendants de sa volonté. Bien que l’entreprise s’efforce de minimiser ces interruptions et d’informer les utilisateurs en amont, elle ne peut garantir un accès constant et ininterrompu à l’application. Les utilisateurs sont responsables de vérifier la compatibilité de leurs équipements et de leur connexion internet pour éviter toute difficulté d’utilisation liée à des facteurs externes."
    ]
  }
]

const CGUPage = () => {
  const navigate = useNavigate()

  return (
    <BackgroundLayout backgroundImage="/images/backgrounds/parking-background.png">
      <SCard>
        <SCardContent>
          <Flex justifyCenter gap="1em">
            <Logo src="/images/logos/logo.png" alt="RenteCaisse Logo" />
            <BrandName>RENTECAISSE</BrandName>
          </Flex>
          <Title>Conditions Générales d'Utilisation (CGU)</Title>
          <div>
            {cgu.map((section) => (
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

export default CGUPage; 