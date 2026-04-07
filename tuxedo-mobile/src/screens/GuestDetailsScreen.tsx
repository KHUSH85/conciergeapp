import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Share, Clipboard } from 'react-native';
import { MotiView } from 'moti';
import { Phone, Mail, ArrowLeft, Link, Copy, CheckCircle2 } from 'lucide-react-native';
import { GlassCard, GoldButton } from '../components/GlassCard';
import { ScreenShell } from '../components/ScreenShell';
import { useApp } from '../context/AppContext';

const GOLD = '#D4AF37';

// Base URL of the deployed Vercel website
const WEBSITE_BASE_URL = 'https://conciergeapptuxedo.vercel.app';

function generateRideToken(): string {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

function buildPassengerLink(pickup: string): string {
  const token = generateRideToken();
  const params = new URLSearchParams({ token, pickup });
  return `${WEBSITE_BASE_URL}/track-ride?${params.toString()}`;
}

export const GuestDetailsScreen = ({ navigation, route }: any) => {
  const { user } = useApp();
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [contactMethod, setContactMethod] = useState<'phone' | 'email'>('phone');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailChange = (val: string) => {
    setGuestEmail(val);
    setEmailError(val && !validateEmail(val) ? 'Please enter a valid email address' : '');
  };

  const canSubmit = contactMethod === 'phone'
    ? guestPhone.length > 5
    : (guestEmail && validateEmail(guestEmail) && !emailError);

  const pickupLocation = route.params?.pickupLocation || user?.hotelName || 'The Grand Majestic Hotel';

  const handleRequest = () => {
    const link = buildPassengerLink(pickupLocation);
    setGeneratedLink(link);
    navigation.navigate('WaitingForPayment', {
      guestPhone: contactMethod === 'phone' ? guestPhone : '',
      guestEmail: contactMethod === 'email' ? guestEmail : '',
      bookingMode: 'instant',
      pickupLocation,
      passengerLink: link,
    });
  };

  const handleGenerateLink = () => {
    const link = buildPassengerLink(pickupLocation);
    setGeneratedLink(link);
  };

  const handleCopy = () => {
    Clipboard.setString(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    Share.share({
      message: `Your Tuxedo Chauffeur is ready. Tap to track your ride: ${generatedLink}`,
      url: generatedLink,
    });
  };

  return (
    <ScreenShell keyboardAvoiding>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color={GOLD} size={18} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <GlassCard style={styles.card}>
          <Text style={styles.title}>Guest Information</Text>
          <Text style={styles.subtitle}>* Tracking link will be sent automatically to the guest.</Text>

          <MotiView
            key={contactMethod}
            from={{ opacity: 0, translateX: contactMethod === 'phone' ? -20 : 20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 300 }}
          >
            <View style={styles.inputWrap}>
              {contactMethod === 'phone'
                ? <Phone color={GOLD} size={20} style={styles.inputIcon} />
                : <Mail color={GOLD} size={20} style={styles.inputIcon} />
              }
              <TextInput
                style={styles.input}
                placeholder={contactMethod === 'phone' ? 'Guest Phone Number' : 'Guest Email Address'}
                placeholderTextColor="#6b7280"
                value={contactMethod === 'phone' ? guestPhone : guestEmail}
                onChangeText={contactMethod === 'phone' ? setGuestPhone : handleEmailChange}
                keyboardType={contactMethod === 'phone' ? 'phone-pad' : 'email-address'}
                autoCapitalize="none"
              />
            </View>
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          </MotiView>

          <TouchableOpacity onPress={() => setContactMethod(contactMethod === 'phone' ? 'email' : 'phone')} style={styles.switchBtn}>
            <Text style={styles.switchText}>
              {contactMethod === 'phone' ? "Don't have a phone? Use Email instead" : 'Use Phone Number instead'}
            </Text>
          </TouchableOpacity>

          {/* Generate Link button — shows the link before sending */}
          {!generatedLink && (
            <TouchableOpacity onPress={handleGenerateLink} style={styles.generateBtn}>
              <Link color={GOLD} size={16} />
              <Text style={styles.generateBtnText}>Preview Passenger Link</Text>
            </TouchableOpacity>
          )}

          {/* Generated link display */}
          {generatedLink ? (
            <MotiView
              from={{ opacity: 0, translateY: 8 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 300 }}
              style={styles.linkBox}
            >
              <Text style={styles.linkLabel}>Passenger Deep Link</Text>
              <Text style={styles.linkText} numberOfLines={2}>{generatedLink}</Text>
              <View style={styles.linkActions}>
                <TouchableOpacity onPress={handleCopy} style={styles.linkActionBtn}>
                  {copied
                    ? <CheckCircle2 color="#22c55e" size={16} />
                    : <Copy color={GOLD} size={16} />
                  }
                  <Text style={[styles.linkActionText, copied && { color: '#22c55e' }]}>
                    {copied ? 'Copied!' : 'Copy'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleShare} style={styles.linkActionBtn}>
                  <Link color={GOLD} size={16} />
                  <Text style={styles.linkActionText}>Share</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.linkNote}>
                Tap the link on iOS/Android to open the Passenger app directly
              </Text>
            </MotiView>
          ) : null}

          <GoldButton onPress={handleRequest} disabled={!canSubmit} style={styles.btn}>
            <Text style={styles.btnText}>Send Chauffeur Request</Text>
          </GoldButton>
        </GlassCard>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  backText: { color: GOLD, fontWeight: '700', fontSize: 14 },
  card: { padding: 24 },
  title: { fontSize: 22, color: '#fff', fontWeight: '900', marginBottom: 8 },
  subtitle: { fontSize: 13, color: '#9ca3af', fontStyle: 'italic', fontWeight: '500', marginBottom: 24 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', borderWidth: 2, borderColor: 'rgba(212,175,55,0.3)', borderRadius: 12, paddingHorizontal: 14, marginBottom: 8 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: '#fff', fontSize: 16, paddingVertical: 14, fontWeight: '500' },
  errorText: { color: '#f87171', fontSize: 12, marginBottom: 8, marginLeft: 4 },
  switchBtn: { marginBottom: 16, marginTop: 8 },
  switchText: { color: GOLD, fontWeight: '700', fontSize: 13 },
  generateBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(212,175,55,0.3)', borderStyle: 'dashed' },
  generateBtnText: { color: GOLD, fontWeight: '700', fontSize: 13 },
  linkBox: { backgroundColor: 'rgba(212,175,55,0.05)', borderWidth: 2, borderColor: 'rgba(212,175,55,0.3)', borderRadius: 12, padding: 14, marginBottom: 16 },
  linkLabel: { color: GOLD, fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  linkText: { color: '#fff', fontSize: 12, fontWeight: '500', marginBottom: 10, lineHeight: 18 },
  linkActions: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  linkActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, paddingHorizontal: 12, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 8, borderWidth: 1, borderColor: 'rgba(212,175,55,0.2)' },
  linkActionText: { color: GOLD, fontSize: 12, fontWeight: '700' },
  linkNote: { color: '#6b7280', fontSize: 10, fontStyle: 'italic' },
  btn: { width: '100%', paddingVertical: 18 },
  btnText: { color: '#000', fontWeight: '900', fontSize: 15, textAlign: 'center', textTransform: 'uppercase' },
});
