import { StyleSheet, Platform } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// ====================
// Variables de Diseño
// ====================
export const colors = {
  primary: '#2196F3',       // Azul principal
  primaryDark: '#1976D2',   // Azul oscuro
  secondary: '#9C27B0',     // Morado
  background: '#F9F9F9',    // Fondo gris
  surface: '#121212',       // Superficies oscuras
  error: '#FF5252',         // Rojo para errores
  success: '#4CAF50',       // Verde para éxito
  warning: '#FFC107',       // Amarillo para advertencias
  textPrimary: '#FFFFFF',   // Texto principal
  textSecondary: '#BDBDBD', // Texto secundario
  white: '#FFFFFF',
  black: '#000000',
  tertiary: '#4285F4',      // Azul para chatbot
  chatButton: '#34A853',    // Verde para botón de chatbot
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 20,
  xxl: 28,
  circle: 100,
};

export const text = {
  xsmall: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.textPrimary,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.black,
  },
  h6: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  h5: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  h4: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  h3: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '500',
    color: colors.textPrimary,
  },
};

// ====================
// Estilos Globales
// ====================
export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screen: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

// ====================
// Componentes Cámara
// ====================
export const cameraStyles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    paddingBottom: spacing.xl,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: radius.circle,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 3,
    borderColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: radius.circle,
    backgroundColor: colors.white,
  },
  sideButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: spacing.sm,
    borderRadius: radius.md,
    minWidth: 80,
    alignItems: 'center',
  },
  zoomControls: {
    position: 'absolute',
    right: spacing.md,
    top: '50%',
    transform: [{ translateY: -50 }],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: radius.lg,
    padding: spacing.sm,
  },
  zoomButton: {
    padding: spacing.sm,
  },
  chatButton: {
    position: 'absolute',
    top: spacing.xl,
    right: spacing.md,
    backgroundColor: colors.chatButton,
    borderRadius: radius.circle,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    ...globalStyles.shadow,
  },
});

// ====================
// Componentes de Resultados
// ====================
export const resultStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  image: {
    width: '100%',
    height: '50%',
    resizeMode: 'cover',
  },
  resultCard: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    marginTop: -radius.xl,
    flex: 1,
  },
  title: {
    ...text.h4,
    color: colors.success,
    marginBottom: spacing.md,
  },
  resultText: {
    ...text.body,
    marginBottom: spacing.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: spacing.sm,
    ...text.body,
    fontWeight: '500',
  },
  chatButton: {
    backgroundColor: colors.chatButton,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
    marginHorizontal: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...globalStyles.shadow,
  },
  chatButtonText: {
    ...text.body,
    color: colors.white,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
});

// ====================
// Componentes de Historial
// ====================
export const historyStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.sm,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  itemImage: {
    width: 100,
    height: 100,
  },
  itemContent: {
    flex: 1,
    padding: spacing.sm,
  },
  itemDate: {
    ...text.xsmall,
    color: colors.textSecondary,
  },
  itemResult: {
    ...text.body,
    fontWeight: '500',
    marginVertical: spacing.xs,
  },
  itemConfidence: {
    ...text.small,
    color: colors.success,
  },
  emptyText: {
    ...text.body,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  backButton: {
    backgroundColor: colors.error,
    margin: spacing.md,
  },
  chatButton: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.md,
    backgroundColor: colors.chatButton,
    borderRadius: radius.circle,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    ...globalStyles.shadow,
  },
});

// ====================
// Componentes Compartidos
// ====================
export const commonStyles = StyleSheet.create({
  button: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    ...text.body,
    fontWeight: '500',
    color: colors.white,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
  tertiaryButton: {
    backgroundColor: colors.tertiary,
  },
  chatButton: {
    backgroundColor: colors.chatButton,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  loadingIndicator: {
    marginVertical: spacing.lg,
  },
});

// ====================
// Utilidades Rápidas
// ====================
export const utilityStyles = StyleSheet.create({
  mt_sm: { marginTop: spacing.sm },
  mt_md: { marginTop: spacing.md },
  mt_lg: { marginTop: spacing.lg },
  mb_sm: { marginBottom: spacing.sm },
  mb_md: { marginBottom: spacing.md },
  mb_lg: { marginBottom: spacing.lg },
  p_sm: { padding: spacing.sm },
  p_md: { padding: spacing.md },
  p_lg: { padding: spacing.lg },
  textCenter: { textAlign: 'center' },
  flexRow: { flexDirection: 'row' },
  flex1: { flex: 1 },
});

// ====================
// AnalysisDetailScreen
// ====================
export const AnalysisDetailScreen_styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    paddingTop: Platform.OS === "ios" ? hp('8%') : hp('6%'),
    paddingBottom: hp('2%'),
    backgroundColor: '#2D46FF',
  },
  headerTitle: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    paddingHorizontal: wp('5%'),
    paddingBottom: hp('10%'),
  },
  imageContainer: {
    backgroundColor: 'white',
    borderRadius: wp('3%'),
    padding: wp('3%'),
    marginBottom: hp('2%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  analysisImage: {
    width: '100%',
    height: hp('30%'),
    borderRadius: wp('2%'),
  },
  card: {
    backgroundColor: 'white',
    borderRadius: wp('3%'),
    padding: wp('5%'),
    marginBottom: hp('2%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: '#2D46FF',
    marginBottom: hp('1.5%'),
  },
  diagnosisText: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    color: '#333',
    marginBottom: hp('1.5%'),
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  detailText: {
    fontSize: wp('3.5%'),
    color: '#666',
    marginLeft: wp('2%'),
  },
  recommendationText: {
    fontSize: wp('3.5%'),
    color: '#333',
    lineHeight: hp('3%'),
  },
  shareButton: {
    position: 'absolute',
    bottom: hp('3%'),
    right: wp('5%'),
    backgroundColor: '#2D46FF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('5%'),
    borderRadius: wp('7%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  shareButtonText: {
    fontSize: wp('4%'),
    color: 'white',
    marginLeft: wp('2%'),
    fontWeight: '500',
  },
});

// ====================
// ChatBotScreen
// ====================
export const ChatBotScreen_styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp('5%'),
    paddingTop: Platform.OS === "ios" ? hp('8%') : hp('6%'),
    paddingBottom: hp('2%'),
    backgroundColor: "#2D46FF",
  },
  backButton: {
    padding: wp('2%'),
  },
  headerTitle: {
    fontSize: wp('5%'),
    fontWeight: "bold",
    color: "white",
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    alignItems: "center",
    padding: wp('4%'),
    marginBottom: hp('2%'),
    backgroundColor: "#fff",
    borderRadius: wp('3%'),
    elevation: 2,
  },
  analysisImage: {
    width: wp('40%'),
    height: wp('40%'),
    borderRadius: wp('2%'),
  },
  diagnosisText: {
    marginTop: hp('1%'),
    fontSize: wp('4.3%'),
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#2D46FF",
    padding: wp('4%'),
    borderRadius: wp('4%'),
    marginVertical: hp('1%'),
    marginHorizontal: wp('3%'),
    maxWidth: "80%",
    borderBottomRightRadius: 0,
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#f0f0f0",
    padding: wp('4%'),
    borderRadius: wp('4%'),
    marginVertical: hp('1%'),
    marginHorizontal: wp('3%'),
    maxWidth: "80%",
    borderBottomLeftRadius: 0,
  },
  userMessageText: {
    color: "white",
    fontSize: wp('4%'),
  },
  botMessageText: {
    color: "#333",
    fontSize: wp('4%'),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: wp('10%'),
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1%'),
    marginRight: wp('2%'),
    backgroundColor: "#fff",
    fontSize: wp('4%'),
    minHeight: hp('5%'),
    maxHeight: hp('20%'),
  },
  sendButton: {
    backgroundColor: "#2D46FF",
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    justifyContent: "center",
    alignItems: "center",
  },
  loadingIndicator: {
    marginHorizontal: wp('2%'),
  },
  messagesContainer: {
    flex: 1,
    paddingBottom: Platform.select({
      ios: hp('10%'),
      android: hp('8%')
    }),
  },
});

// ====================
// DiseaseCatalogScreen
// ====================
export const DiseaseCatalogScreen_styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp('5%'),
    paddingTop: Platform.OS === "ios" ? hp('7%') : hp('6%'),
    paddingBottom: hp('2%'),
    backgroundColor: "#2D46FF",
  },
  welcomeText: {
    fontSize: wp('5%'),
    fontWeight: "bold",
    color: "white",
  },
  content: {
    paddingHorizontal: wp('4%'),
    paddingTop: hp('1.5%'),
  },
  sectionTitle: {
    fontSize: wp('4.5%'),
    fontWeight: "bold",
    color: "#333",
    marginVertical: hp('1.5%'),
  },
  analysisCard: {
    backgroundColor: "white",
    borderRadius: wp('3%'),
    padding: wp('4%'),
    marginBottom: hp('1.5%'),
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
  analysisImage: {
    width: wp('16%'),
    height: wp('16%'),
    borderRadius: wp('2%'),
    marginRight: wp('3%'),
  },
  analysisInfo: {
    flex: 1,
  },
  analysisResult: {
    color: "#333",
    fontWeight: "500",
    fontSize: wp('4.2%'),
  },
  analysisDate: {
    color: "#666",
    fontSize: wp('3.5%'),
    marginTop: hp('0.5%'),
  },
});

// ====================
// DiseaseDetailScreen
// ====================
export const DiseaseDetailScreen_styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2D46FF',
    paddingHorizontal: wp('5%'),
    paddingTop: Platform.OS === "ios" ? hp('8%') : hp('6%'),
    paddingBottom: hp('2.5%'),
  },
  headerTitle: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: 'white',
  },
  scrollContainer: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: hp('25%'),
  },
  content: {
    paddingHorizontal: wp('4%'),
    paddingTop: hp('2%'),
    paddingBottom: hp('3%'),
  },
  sectionTitle: {
    fontSize: wp('4.5%'),
    fontWeight: "bold",
    color: "#333",
    marginTop: hp('2%'),
    marginBottom: hp('1%'),
  },
  description: {
    color: "#333",
    fontSize: wp('4%'),
    marginBottom: hp('2.5%'),
    lineHeight: hp('3%'),
    fontWeight: '500',
  },
  subtext: {
    color: "#444",
    fontSize: wp('3.8%'),
    lineHeight: hp('3%'),
    marginBottom: hp('2%'),
  },
});

// ====================
// HistoryScreen
// ====================
export const HistoryScreen_styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2D46FF',
    paddingHorizontal: wp('5%'),
    paddingTop: Platform.OS === "ios" ? hp('8%') : hp('6%'),
    paddingBottom: hp('2.5%'),
  },
  headerTitle: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: wp('5%'),
    paddingTop: hp('1%'),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    color: '#888',
    fontSize: wp('4%'),
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: wp('4%'),
    borderRadius: wp('3%'),
    marginBottom: hp('1.5%'),
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: wp('16%'),
    height: wp('16%'),
    borderRadius: wp('2%'),
    marginRight: wp('4%'),
  },
  info: {
    flex: 1,
  },
  disease: {
    fontSize: wp('4.2%'),
    fontWeight: '600',
    color: '#333',
  },
  date: {
    fontSize: wp('3.5%'),
    color: '#666',
    marginTop: hp('0.5%'),
  },
});

// ====================
// HomeScreen
// ====================
export const HomeScreen_styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp('5%'),
    paddingTop: Platform.OS === "ios" ? hp('9%') : hp('7%'),
    paddingBottom: hp('2.5%'),
    backgroundColor: "#2D46FF",
  },
  welcomeText: {
    fontSize: wp('5%'),
    fontWeight: "bold",
    color: "white",
  },
  avatar: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('6%'),
    backgroundColor: "white",
  },
  content: {
    paddingHorizontal: wp('4%'),
    paddingBottom: hp('3%'),
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: hp('2.5%'),
    marginTop: 10,
    gap: wp('1.5%'),
  },
  actionCard: {
    width: '32%',
    backgroundColor: 'white',
    borderRadius: wp('3%'),
    paddingVertical: hp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  actionText: {
    marginTop: hp('1%'),
    color: "#333",
    fontWeight: "500",
    textAlign: 'center',
    fontSize: wp('3.2%'),
  },
  sectionTitle: {
    fontSize: wp('4.5%'),
    fontWeight: "bold",
    color: "#333",
    marginVertical: hp('1.5%'),
  },
  analysisCard: {
    backgroundColor: "white",
    borderRadius: wp('3%'),
    padding: wp('3%'),
    marginBottom: hp('1.5%'),
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
  analysisImage: {
    width: wp('16%'),
    height: wp('16%'),
    borderRadius: wp('2%'),
    marginRight: wp('3%'),
  },
  analysisInfo: {
    flex: 1,
  },
  analysisDate: {
    color: "#666",
    fontSize: wp('3.5%'),
  },
  analysisResult: {
    color: "#333",
    fontWeight: "500",
    fontSize: wp('4.2%'),
  },
  emptyText: {
    color: "#999",
    textAlign: "center",
    marginVertical: hp('2%'),
    fontSize: wp('3.8%'),
  },
  tipCard: {
    backgroundColor: "white",
    borderRadius: wp('3%'),
    padding: wp('4%'),
    marginTop: hp('1%'),
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
  tipText: {
    marginLeft: wp('3%'),
    color: "#333",
    flex: 1,
    fontSize: wp('3.8%'),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

// ====================
// LoginScreen
// ====================
export const LoginScreen_styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  gradientContainer: {
    height: hp('40%'),
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp('2%'),
  },
  headerContent: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: hp('2%'),
    alignItems: 'center',
  },
  title: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: '#fff',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: wp('3%'),
    padding: wp('6%'),
    marginHorizontal: wp('5%'),
    marginTop: -hp('8%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffeeee',
    padding: wp('3%'),
    borderRadius: wp('2%'),
    marginBottom: hp('2%'),
  },
  errorText: {
    color: '#ff4444',
    marginLeft: wp('2%'),
    fontSize: wp('3.5%'),
  },
  label: {
    fontSize: wp('3.8%'),
    color: '#555',
    marginBottom: hp('1%'),
    fontWeight: '500',
  },
  input: {
    height: hp('6.5%'),
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: wp('2%'),
    marginBottom: hp('2%'),
    paddingLeft: wp('4%'),
    backgroundColor: '#F9F9F9',
    fontSize: wp('3.8%'),
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: hp('2.5%'),
  },
  passwordInput: {
    height: hp('6.5%'),
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: wp('2%'),
    paddingLeft: wp('4%'),
    paddingRight: wp('10%'),
    backgroundColor: '#F9F9F9',
    fontSize: wp('3.8%'),
  },
  eyeIcon: {
    position: 'absolute',
    right: wp('4%'),
    top: hp('1.8%'),
  },
  button: {
    backgroundColor: '#2D46FF',
    paddingVertical: hp('2%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
    marginTop: hp('1.5%'),
  },
  buttonText: {
    color: '#fff',
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
  },
  signUpButton: {
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  signUpText: {
    color: '#2D46FF',
    fontSize: wp('3.8%'),
  },
  footerText: {
    textAlign: 'center',
    marginTop: hp('3%'),
    color: '#666',
    fontSize: wp('3.2%'),
  },
});

// ====================
// SettingsScreen
// ====================
export const SettingsScreen_styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    height: hp('10%'),
    backgroundColor: '#2D46FF',
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: wp('5%'),
    paddingTop: hp('2%'),
  },
  userContainer: {
    alignItems: 'center',
    marginBottom: hp('4%'),
    backgroundColor: 'white',
    borderRadius: wp('3%'),
    padding: wp('5%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    backgroundColor: '#E8F0FE',
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('10%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  userName: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp('0.5%'),
  },
  userEmail: {
    fontSize: wp('4%'),
    color: '#666',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('5%'),
    borderRadius: wp('3%'),
    borderWidth: 1,
    borderColor: '#FF3B30',
    marginTop: hp('2%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: wp('4%'),
    fontWeight: '500',
    marginLeft: wp('2.5%'),
  },
  versionText: {
    textAlign: 'center',
    color: '#999',
    marginTop: hp('4%'),
    fontSize: wp('3.5%'),
  },
});

// ====================
// SignUpScreen
// ====================
export const SignUpScreen_styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#2D46FF',
  },
  dismissKeyboard: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: hp('2.5%'),
  },
  topIconContainer: {
    alignItems: 'center',
    marginTop: hp('5%'),
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: wp('3%'),
    padding: wp('6%'),
    marginHorizontal: wp('5%'),
    marginTop: hp('4%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  backButton: {
    position: 'absolute',
    left: wp('2.5%'),
    top: hp('2%'),
    zIndex: 1,
    padding: wp('2%'),
  },
  title: {
    fontSize: wp('6.5%'),
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: hp('3%'),
  },
  label: {
    fontSize: wp('3.8%'),
    color: '#555',
    marginBottom: hp('1%'),
    fontWeight: '500',
  },
  input: {
    height: hp('6.5%'),
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: wp('2%'),
    marginBottom: hp('2.5%'),
    paddingLeft: wp('4%'),
    backgroundColor: '#F9F9F9',
    fontSize: wp('3.8%'),
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: hp('2.5%'),
  },
  passwordInput: {
    height: hp('6.5%'),
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: wp('2%'),
    paddingLeft: wp('4%'),
    paddingRight: wp('10%'),
    backgroundColor: '#F9F9F9',
    fontSize: wp('3.8%'),
  },
  eyeIcon: {
    position: 'absolute',
    right: wp('4%'),
    top: hp('1.8%'),
  },
  button: {
    backgroundColor: '#2D46FF',
    paddingVertical: hp('2%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
    marginTop: hp('1.5%'),
  },
  buttonText: {
    color: '#fff',
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffeeee',
    padding: wp('3%'),
    borderRadius: wp('2%'),
    marginBottom: hp('2%'),
  },
  errorText: {
    color: '#ff4444',
    marginLeft: wp('2.5%'),
    fontSize: wp('3.5%'),
  },
});