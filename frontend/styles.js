import { StyleSheet } from 'react-native';

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