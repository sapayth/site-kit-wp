/**
 * AdSense Settings form.
 *
 * Site Kit by Google, Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { ProgressBar } from 'googlesitekit-components';
import { MODULES_ADSENSE } from '../../datastore/constants';
import {
	parseAccountID,
	parseAccountIDFromExistingTag,
} from '../../util/parsing';
import {
	ErrorNotices,
	UseSnippetSwitch,
	AutoAdExclusionSwitches,
	AdBlockingRecoveryToggle,
} from '../common';
import WebStoriesAdUnitSelect from '../common/WebStoriesAdUnitSelect';
import Link from '../../../../components/Link';
import { CORE_SITE } from '../../../../googlesitekit/datastore/site/constants';
import AdBlockingRecoveryCTA from '../common/AdBlockingRecoveryCTA';
import SettingsNotice from '../../../../components/SettingsNotice/SettingsNotice';
const { useSelect } = Data;

export default function SettingsForm() {
	const webStoriesActive = useSelect( ( select ) =>
		select( CORE_SITE ).isWebStoriesActive()
	);
	const accountID = useSelect( ( select ) =>
		select( MODULES_ADSENSE ).getAccountID()
	);
	const clientID = useSelect( ( select ) =>
		select( MODULES_ADSENSE ).getClientID()
	);
	const existingTag = useSelect( ( select ) =>
		select( MODULES_ADSENSE ).getExistingTag()
	);
	const hasResolvedGetExistingTag = useSelect( ( select ) =>
		select( MODULES_ADSENSE ).hasFinishedResolution( 'getExistingTag' )
	);
	const existingAdBlockingRecoveryTag = useSelect( ( select ) =>
		select( MODULES_ADSENSE ).getExistingAdBlockingRecoveryTag()
	);
	const hasResolvedGetExistingAdBlockingRecoveryTag = useSelect( ( select ) =>
		select( MODULES_ADSENSE ).hasFinishedResolution(
			'getExistingAdBlockingRecoveryTag'
		)
	);

	if (
		! hasResolvedGetExistingTag ||
		! hasResolvedGetExistingAdBlockingRecoveryTag
	) {
		return <ProgressBar />;
	}

	let checkedMessage, uncheckedMessage;
	if ( existingTag && existingTag === clientID ) {
		// Existing tag with permission.
		checkedMessage = __(
			'You’ve already got an AdSense code on your site for this account, we recommend you use Site Kit to place code to get the most out of AdSense.',
			'google-site-kit'
		);
		uncheckedMessage = checkedMessage;
	} else if ( existingTag ) {
		// Existing tag without permission.
		checkedMessage = sprintf(
			/* translators: %s: account ID */
			__(
				'Site Kit detected AdSense code for a different account %s on your site. For a better ads experience, you should remove AdSense code that’s not linked to this AdSense account.',
				'google-site-kit'
			),
			parseAccountID( existingTag )
		);
		uncheckedMessage = __(
			'Please note that AdSense will not show ads on your website unless you’ve already placed the code.',
			'google-site-kit'
		);
	} else {
		// No existing tag.
		uncheckedMessage = __(
			'Please note that AdSense will not show ads on your website unless you’ve already placed the code.',
			'google-site-kit'
		);
	}

	let existingAdBlockingRecoveryTagMessage;
	if (
		existingAdBlockingRecoveryTag &&
		existingAdBlockingRecoveryTag === accountID
	) {
		existingAdBlockingRecoveryTagMessage = __(
			'You’ve already got an Ad Blocking Recovery code on your site. We recommend you use Site Kit to manage this to get the most out of AdSense.',
			'google-site-kit'
		);
	} else if ( existingAdBlockingRecoveryTag ) {
		existingAdBlockingRecoveryTagMessage = sprintf(
			/* translators: %s: account ID */
			__(
				'Site Kit detected Ad Blocking Recovery code for a different account %s on your site. For a better ad blocking recovery experience, you should remove Ad Blocking Recovery code that’s not linked to this AdSense account.',
				'google-site-kit'
			),
			parseAccountIDFromExistingTag( existingAdBlockingRecoveryTag )
		);
	}

	const supportURL =
		'https://support.google.com/adsense/answer/10175505#create-an-ad-unit-for-web-stories';

	return (
		<div className="googlesitekit-adsense-settings-fields">
			<ErrorNotices />

			<UseSnippetSwitch
				checkedMessage={ checkedMessage }
				uncheckedMessage={ uncheckedMessage }
			/>

			{ webStoriesActive && (
				<Fragment>
					<WebStoriesAdUnitSelect />
					<p>
						{ __(
							'This ad unit will be used for your Web Stories.',
							'google-site-kit'
						) }{ ' ' }
						<Link
							href={ supportURL }
							external
							aria-label={ __(
								'Learn more about Ad Sense Web Stories.',
								'google-site-kit'
							) }
						>
							{ __( 'Learn more', 'google-site-kit' ) }
						</Link>
					</p>
				</Fragment>
			) }

			<AutoAdExclusionSwitches />

			{ existingAdBlockingRecoveryTag && (
				<SettingsNotice
					notice={ existingAdBlockingRecoveryTagMessage }
				/>
			) }

			<AdBlockingRecoveryCTA />

			<AdBlockingRecoveryToggle />
		</div>
	);
}
